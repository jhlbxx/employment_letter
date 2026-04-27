import React, { useState, useEffect, useRef } from 'react';
import { templates } from './templates';
import { Fish, Download, Printer, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import pkg from '../package.json';
import { Languages, Table, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

const UI_STRINGS = {
  zh: {
    templates: "Templates / 模板",
    editor: "内容编辑",
    langZh: "仅中文",
    langEn: "仅英文",
    langDual: "中英对照",
    exportBtn: "Export PDF / 导出 PDF",
    exporting: "导出中…",
    printBtn: "Print / 打印",
    version: "Version / 版本",
    updated: "Last Updated / 更新日期",
    uiLangLabel: "界面语言 / Language",
    letterLangLabel: "信件语言",
    catEmployment: "雇主信类",
    catNotice: "通知与申请类",
    catTermination: "离职与解雇类",
    collapse: "折叠",
    expand: "展开",
    expandEditor: "展开内容编辑",
    expandTemplates: "展开模板",
    modeLabel: "编辑模式",
    batchMode: "批量模式",
    singleMode: "单人模式",
    downloadTemplate: "下载 Excel 模版",
    uploadCsv: "上传数据表格 (.xlsx)",
    batchSummary: "共识别到 {count} 条数据",
    startBatch: "开始批量生成 (ZIP)",
    batchProgress: "正在生成第 {current}/{total} 份...",
    batchComplete: "批量生成完成！",
    batchError: "表格格式有误，请检查标题行",
    batchNote: "请确保表格列名与输入框标签完全一致",
    batchEmpty: "暂无数据，请先下载模版并填写上传",
    previewOnly: "仅显示前 10 条预览",
  },
  en: {
    templates: "Templates",
    editor: "Editor",
    langZh: "Chinese Only",
    langEn: "English Only",
    langDual: "Bilingual",
    exportBtn: "Export PDF",
    exporting: "Exporting...",
    printBtn: "Print",
    version: "Version",
    updated: "Last Updated",
    uiLangLabel: "界面语言 / Language",
    letterLangLabel: "Letter Language",
    catEmployment: "Employment Letters",
    catNotice: "Notices & Requests",
    catTermination: "Separation & Termination",
    collapse: "Collapse",
    expand: "Expand",
    expandEditor: "Expand Editor",
    expandTemplates: "Expand Templates",
    modeLabel: "Editor Mode",
    batchMode: "Batch Mode",
    singleMode: "Single Mode",
    downloadTemplate: "Download Excel Template",
    uploadCsv: "Upload Data (.xlsx)",
    batchSummary: "Recognized {count} records",
    startBatch: "Start Batch Generation (ZIP)",
    batchProgress: "Generating {current}/{total}...",
    batchComplete: "Batch Complete!",
    batchError: "File format error, please check headers",
    batchNote: "Ensure Excel column names match input labels exactly",
    batchEmpty: "No data found. Please download the template, fill it out, and upload.",
    previewOnly: "Showing first 10 records only",
  }
};

const CURRENCY_FIELDS = ['salary', 'monthlyBase', 'annualBonus', 'statutoryComp', 'extraComp'];
const UNIT_FIELDS = ['noticePeriod'];

const UNIT_TRANSLATIONS = {
  zh: { day: '天', month: '个月' },
  en: { day: 'day(s)', month: 'month(s)' }
};

/** Formats a number string with commas and 2 decimal places for the final letter */
function formatToCurrency(val) {
  if (!val) return val;
  const num = parseFloat(val.toString().replace(/,/g, ''));
  if (isNaN(num)) return val;
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Formats a number string with commas only for display in the input field */
function formatForInput(val) {
  if (!val) return '';
  const parts = val.toString().replace(/,/g, '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

// ── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, message: err.message };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-screen">
          <h1>⚠️ 应用加载出错</h1>
          <p>错误信息：{this.state.message}</p>
          <button onClick={() => window.location.reload()}>重新加载</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** For sidebar display: 'dual' maps to 'zh', otherwise use the lang itself */
const sidebarLang = (lang) => (lang === 'dual' ? 'zh' : lang);

/** Replace {{key}} vars and {{#key}}...{{/key}} conditional blocks, then clean up leftovers */
function renderTemplate(contentTemplate, formData, lang) {
  if (!contentTemplate) return '';
  let out = contentTemplate;

  // 1. Replace conditional blocks
  Object.keys(formData).forEach((key) => {
    const regex = new RegExp(`{{#${key}}}([\\s\\S]*?){{\\/${key}}}`, 'g');
    if (formData[key]) {
      out = out.replace(regex, '$1');
    } else {
      out = out.replace(regex, '');
    }
  });

  // 2. Replace simple variables
  Object.keys(formData).forEach((key) => {
    let val = formData[key]
      ? formData[key]
      : '<span style="color:#aaa">[ ' + key + ' ]</span>';
    
    // Apply currency formatting if applicable
    if (formData[key] && CURRENCY_FIELDS.includes(key)) {
      val = formatToCurrency(val);
    }
    
    // Apply unit translation for specific fields (e.g. Notice Period)
    if (UNIT_FIELDS.includes(key)) {
      const num = formData[key + '_num'] || '';
      const unitKey = formData[key + '_unit'] || 'day';
      if (num) {
        // Get target language for translation (lang here is the 'inner' lang during dual rendering)
        const targetLang = lang === 'dual' ? 'en' : lang; // This is slightly tricky, see below
        // Actually, the 'lang' variable in scope here is the one passed to renderTemplate(..., lang)
        const unitLabel = UNIT_TRANSLATIONS[lang] ? UNIT_TRANSLATIONS[lang][unitKey] : UNIT_TRANSLATIONS['en'][unitKey];
        val = num + ' ' + unitLabel;
      } else {
        val = '<span style="color:#aaa">[ ' + key + ' ]</span>';
      }
    }
    
    out = out.split('{{' + key + '}}').join(val);
  });

  // 3. Clean up any leftover unreplaced placeholders
  out = out.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, '');
  out = out.replace(/{{\w+}}/g, '');

  // 4. Convert **bold**
  out = out.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  return out;
}

// ── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [formData, setFormData] = useState({});
  const [lang, setLang] = useState('zh');
  const [exporting, setExporting] = useState(false);
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uiLang, setUiLang] = useState('zh');
  const [expandedCats, setExpandedCats] = useState([]);
  const [editorWidth, setEditorWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  
  // Batch Mode States
  const [batchMode, setBatchMode] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [currentBatchItem, setCurrentBatchItem] = useState(null);

  const letterRef = useRef();
  const batchWorkerRef = useRef();

  // --- Resizing Logic ---
  const startResizing = (e) => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing) {
      // Calculate new width relative to the main-content start
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        const newWidth = e.clientX - mainContent.getBoundingClientRect().left;
        if (newWidth > 300 && newWidth < 800) {
          setEditorWidth(newWidth);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  // Sync HTML lang attribute for native elements like date inputs
  useEffect(() => {
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  // Reset form fields when template changes, but keep values for shared field IDs
  useEffect(() => {
    if (!selectedTemplate?.fields) return;
    const next = {};
    selectedTemplate.fields.forEach((f) => {
      next[f.id] = formData[f.id] ?? '';
    });
    setFormData(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- Batch Mode Helpers ---
  
  const downloadExcelTemplate = () => {
    if (!selectedTemplate) return;
    const headers = selectedTemplate.fields.map(f => f.label[uiLang]);
    
    // Create worksheet with headers
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    
    // Generate file
    XLSX.writeFile(wb, `${selectedTemplate.name[uiLang]}_Template.xlsx`);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      // Map labels back to IDs
      const labelToId = {};
      selectedTemplate.fields.forEach(f => {
        labelToId[f.label[uiLang]] = f.id;
      });

      const mappedData = data.map(row => {
        const newRow = {};
        Object.keys(row).forEach(label => {
          const id = labelToId[label];
          if (id) newRow[id] = row[label];
        });
        return newRow;
      });

      setBatchData(mappedData);
    };
    reader.readAsBinaryString(file);
  };

  const runBatchGeneration = async () => {
    if (batchData.length === 0 || isProcessingBatch) return;
    setIsProcessingBatch(true);
    const zip = new JSZip();
    const total = batchData.length;

    try {
      for (let i = 0; i < total; i++) {
        setBatchProgress({ current: i + 1, total });
        const row = batchData[i];
        
        // 1. Set data for the hidden worker
        setCurrentBatchItem(row);
        
        // 2. Wait for React to render the worker div
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 3. Generate PDF
        const element = batchWorkerRef.current;
        const opt = {
          margin: 0,
          image: { type: 'jpeg', quality: 0.98 },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        const blob = await html2pdf().from(element).set(opt).output('blob');
        
        // 4. Name the file intelligently
        const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('name')) || Object.keys(row)[0];
        const fileName = `${row[nameKey] || 'Record'}_${i + 1}.pdf`;
        zip.file(fileName, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `Batch_${selectedTemplate.name[uiLang]}.zip`);
      alert(UI_STRINGS[uiLang].batchComplete);
    } catch (err) {
      alert('Batch Error: ' + err.message);
    } finally {
      setIsProcessingBatch(false);
      setBatchProgress({ current: 0, total: 0 });
      setCurrentBatchItem(null);
    }
  };

  const exportPDF = async () => {
    if (!letterRef.current || exporting) return;
    setExporting(true);
    try {
      const filename = selectedTemplate?.name[sidebarLang(lang)] || 'Letter';
      await html2pdf()
        .set({
          margin: 0,
          filename: `${filename}.pdf`,
          image: { type: 'jpeg', quality: 1.0 },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          html2canvas: { scale: 3, useCORS: true, letterRendering: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(letterRef.current)
        .save();
    } catch (err) {
      alert('PDF 导出失败：' + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (!templates || templates.length === 0) {
    return <div className="error-screen"><h1>错误：找不到任何模板。</h1></div>;
  }

  const sl = sidebarLang(lang);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="logo-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-icon"><Fish size={22} /></div>
            <div className="company-name">DAVE'S<br />FISH &amp; CHIPS</div>
          </div>
          <button
            className="toggle-sidebar-btn"
            onClick={() => setSidebarCollapsed(true)}
            title={uiLang === 'zh' ? "收起侧边栏" : "Collapse Sidebar"}
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* UI Language Switcher */}
        <div className="ui-lang-switcher">
          <div className="switcher-label">
            <Languages size={14} />
            <span>{UI_STRINGS[uiLang].uiLangLabel}</span>
          </div>
          <div className="switcher-buttons">
            <button 
              className={uiLang === 'zh' ? 'active' : ''} 
              onClick={() => setUiLang('zh')}
            >中文</button>
            <button 
              className={uiLang === 'en' ? 'active' : ''} 
              onClick={() => setUiLang('en')}
            >EN</button>
          </div>
        </div>

        <nav className="template-list">
          <div className="template-section-label">{UI_STRINGS[uiLang].templates}</div>
          
          {[
            { id: 'employment', label: UI_STRINGS[uiLang].catEmployment },
            { id: 'notice', label: UI_STRINGS[uiLang].catNotice },
            { id: 'termination', label: UI_STRINGS[uiLang].catTermination },
          ].map((cat) => {
            const isExpanded = expandedCats.includes(cat.id);
            const catTemplates = templates.filter(t => t.category === cat.id);
            
            if (catTemplates.length === 0) return null;

            return (
              <div key={cat.id} className={`category-group ${isExpanded ? 'expanded' : ''}`}>
                <div 
                  className="category-header" 
                  onClick={() => setExpandedCats(prev => 
                    isExpanded ? prev.filter(c => c !== cat.id) : [...prev, cat.id]
                  )}
                >
                  <ChevronDown size={14} className="cat-chevron" />
                  <span>{cat.label}</span>
                </div>
                <div className="category-content">
                  {catTemplates.map((t) => (
                    <div
                      key={t.id}
                      className={`template-item ${selectedTemplate?.id === t.id ? 'active' : ''}`}
                      onClick={() => setSelectedTemplate(t)}
                    >
                      <div className="template-name">{t.name[uiLang]}</div>
                      <div className="template-desc">{t.description[uiLang]}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="version-info">
            {UI_STRINGS[uiLang].version}: v{pkg.version}
          </div>
          <div className="version-info" style={{ marginTop: '4px' }}>
            {UI_STRINGS[uiLang].updated}: 2026-04-25
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
        <main className="main-content">
          {sidebarCollapsed && (
            <div
              className="expand-handle sidebar-handle"
              onClick={() => setSidebarCollapsed(false)}
            >
              <ChevronRight size={16} />
              <span className="vertical-text">{UI_STRINGS[uiLang].expandTemplates}</span>
            </div>
          )}

          {/* Editor */}
          <section 
            className={`editor-pane ${editorCollapsed ? 'collapsed' : ''}`}
            style={!editorCollapsed ? { width: editorWidth } : {}}
          >
            <div className="editor-header">
              <h2>{UI_STRINGS[uiLang].editor}</h2>
              <button
                className="toggle-editor-btn-styled"
                onClick={() => setEditorCollapsed(true)}
              >
                <ChevronLeft size={16} />
                <span>{UI_STRINGS[uiLang].collapse}</span>
              </button>
            </div>

            <div className="lang-section mode-toggle-section" style={{ marginBottom: '16px' }}>
              <div className="section-label">{UI_STRINGS[uiLang].modeLabel}</div>
              <div className="lang-toggle mode-toggle-group">
                {[
                  [false, UI_STRINGS[uiLang].singleMode], 
                  [true, UI_STRINGS[uiLang].batchMode]
                ].map(([val, label]) => (
                  <button
                    key={val.toString()}
                    className={`lang-btn mode-btn ${batchMode === val ? 'active' : ''}`}
                    onClick={() => setBatchMode(val)}
                  >
                    {val ? <Table size={14} style={{ marginRight: '6px' }} /> : <FileText size={14} style={{ marginRight: '6px' }} />}
                    {label}
                  </button>
                ))}
              </div>
            </div>

          <div className="lang-section">
            <div className="section-label">{UI_STRINGS[uiLang].letterLangLabel}</div>
            <div className="lang-toggle">
              {[
                ['zh', UI_STRINGS[uiLang].langZh], 
                ['en', UI_STRINGS[uiLang].langEn], 
                ['dual', UI_STRINGS[uiLang].langDual]
              ].map(([key, label]) => (
                <button
                  key={key}
                  id={`lang-${key}`}
                  className={`lang-btn ${lang === key ? 'active' : ''}`}
                  onClick={() => setLang(key)}
                >{label}</button>
              ))}
            </div>
          </div>

            {batchMode ? (
              <div className="batch-editor">
                <div className="batch-actions">
                  <button className="btn btn-secondary" onClick={downloadExcelTemplate}>
                    <Download size={14} /> {UI_STRINGS[uiLang].downloadTemplate}
                  </button>
                  <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={14} /> {UI_STRINGS[uiLang].uploadCsv}
                    <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} style={{ display: 'none' }} />
                  </label>
                </div>

                {batchData.length > 0 && (
                  <div className="batch-status-card">
                    <div className="status-info">
                      <CheckCircle2 size={20} color="#10b981" />
                      <div>
                        <strong>{UI_STRINGS[uiLang].batchSummary.replace('{count}', batchData.length)}</strong>
                        <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{UI_STRINGS[uiLang].batchNote}</p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary" 
                      onClick={runBatchGeneration}
                      disabled={isProcessingBatch}
                    >
                      {isProcessingBatch ? (
                        <><Loader2 className="animate-spin" size={16} /> {UI_STRINGS[uiLang].batchProgress.replace('{current}', batchProgress.current).replace('{total}', batchProgress.total)}</>
                      ) : (
                        <><FileText size={16} /> {UI_STRINGS[uiLang].startBatch}</>
                      )}
                    </button>
                  </div>
                )}

                <div className="batch-preview-table">
                  <table>
                    <thead>
                      <tr>
                        {selectedTemplate.fields.map(f => <th key={f.id}>{f.label[uiLang]}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {batchData.length > 0 ? batchData.slice(0, 10).map((row, idx) => (
                        <tr key={idx}>
                          {selectedTemplate.fields.map(f => <td key={f.id}>{row[f.id] || '-'}</td>)}
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={selectedTemplate.fields.length} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div className="batch-empty-hint">
                              <Table size={40} opacity={0.2} />
                              <span>{UI_STRINGS[uiLang].batchEmpty}</span>
                            </div>
                          </td>
                        </tr>
                      )}
                      {batchData.length > 10 && (
                        <tr>
                          <td colSpan={selectedTemplate.fields.length} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#999' }}>
                            ... {UI_STRINGS[uiLang].previewOnly} ...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="fields-container">
                {selectedTemplate?.fields.map((field) => (
                  <div key={field.id} className="form-group">
                    <label htmlFor={'field-' + field.id}>
                      {field.label[uiLang]}
                    </label>
                    {UNIT_FIELDS.includes(field.id) ? (
                      <div className="unit-input-group">
                        <input
                          type="number"
                          placeholder="0"
                          value={formData[field.id + '_num'] ?? ''}
                          onChange={(e) => handleChange(field.id + '_num', e.target.value)}
                        />
                        <select
                          value={formData[field.id + '_unit'] ?? 'day'}
                          onChange={(e) => handleChange(field.id + '_unit', e.target.value)}
                        >
                          <option value="day">{uiLang === 'zh' ? '天' : 'Day(s)'}</option>
                          <option value="month">{uiLang === 'zh' ? '个月' : 'Month(s)'}</option>
                        </select>
                      </div>
                    ) : (
                      <input
                        id={'field-' + field.id}
                        type={field.type || 'text'}
                        placeholder={field.placeholder || ''}
                        value={CURRENCY_FIELDS.includes(field.id) ? formatForInput(formData[field.id]) : (formData[field.id] ?? '')}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (CURRENCY_FIELDS.includes(field.id)) {
                            val = val.replace(/[^0-9.]/g, '');
                            const parts = val.split('.');
                            if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
                          }
                          handleChange(field.id, val);
                        }}
                        onBlur={(e) => {
                          if (CURRENCY_FIELDS.includes(field.id) && formData[field.id]) {
                            const num = parseFloat(formData[field.id]);
                            if (!isNaN(num)) {
                              handleChange(field.id, num.toFixed(2));
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

          <div className="export-area">
            <button
              id="btn-export-pdf"
              className="btn btn-primary"
              onClick={exportPDF}
              disabled={exporting}
            >
              <Download size={16} />
              {exporting ? UI_STRINGS[uiLang].exporting : UI_STRINGS[uiLang].exportBtn}
            </button>
          </div>
          </section>

          {!editorCollapsed && (
            <div className="editor-resizer" onMouseDown={startResizing} />
          )}

          {editorCollapsed && (
          <div
            className="expand-handle"
            onClick={() => setEditorCollapsed(false)}
          >
            <ChevronRight size={16} />
            <span className="vertical-text">{UI_STRINGS[uiLang].expandEditor}</span>
          </div>
        )}

        {/* Preview */}
        <section className="preview-pane">
            <div className="controls">
            <button id="btn-print" className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> {UI_STRINGS[uiLang].printBtn}
            </button>
          </div>

          <div className="letter-paper" ref={letterRef}>
            {/* Letter Header */}
            <header className="letter-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="logo-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
                  <Fish size={18} />
                </div>
                <div className="letter-logo-text">DAVE'S FISH &amp; CHIPS</div>
              </div>
              <div className="letter-contact-info">
                1234 Granville St, Vancouver, BC V6Z 1M4, Canada<br />
                Phone: +1 (604) 555-0199<br />
                Email: hr@dave-is-a-partner.ca<br />
                Website: www.daves-fish-chips.ca
              </div>
            </header>

            {/* Letter Body */}
            <article className="letter-content">
              {lang === 'dual' ? (
                <>
                  <div
                    style={{ marginBottom: 40 }}
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(selectedTemplate?.content?.en || '', formData, 'en'),
                    }}
                  />
                  <div
                    style={{ borderTop: '1px dashed #ddd', paddingTop: 40 }}
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(selectedTemplate?.content?.zh || '', formData, 'zh'),
                    }}
                  />
                </>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderTemplate(selectedTemplate?.content?.[lang] || '', formData, lang),
                  }}
                />
              )}
            </article>

            {/* Letter Footer */}
            <footer className="letter-footer">
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Authorized Signature / 授权签字：</strong>
              </div>
              <div className="signature-space" />
              <div style={{ fontSize: '0.85rem', color: '#555' }}>
                Date / 日期：{new Date().toLocaleDateString()}
              </div>
            </footer>
          </div>
        </section>
      </main>
      {/* --- Batch Generation Worker (Hidden) --- */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div className="letter-paper" ref={batchWorkerRef}>
          <header className="letter-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-icon" style={{ width: 32, height: 32, borderRadius: 8 }}>
                <Fish size={18} />
              </div>
              <div className="letter-logo-text">DAVE'S FISH &amp; CHIPS</div>
            </div>
            <div className="letter-contact-info">
              1234 Granville St, Vancouver, BC V6Z 1M4, Canada<br />
              Phone: +1 (604) 555-0199<br />
              Email: hr@dave-is-a-partner.ca
            </div>
          </header>
          <article className="letter-content">
            {lang === 'dual' ? (
              <>
                <div 
                  style={{ marginBottom: 40 }}
                  dangerouslySetInnerHTML={{ __html: renderTemplate(selectedTemplate?.content?.en || '', currentBatchItem || {}, 'en') }} 
                />
                <div 
                  style={{ borderTop: '1px dashed #ddd', paddingTop: 40 }}
                  dangerouslySetInnerHTML={{ __html: renderTemplate(selectedTemplate?.content?.zh || '', currentBatchItem || {}, 'zh') }} 
                />
              </>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderTemplate(selectedTemplate?.content?.[lang] || '', currentBatchItem || {}, lang) }} />
            )}
          </article>
          <footer className="letter-footer">
            <div style={{ fontSize: '0.9rem' }}><strong>Authorized Signature / 授权签字：</strong></div>
            <div className="signature-space" />
            <div style={{ fontSize: '0.85rem', color: '#555' }}>Date / 日期：{new Date().toLocaleDateString()}</div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
