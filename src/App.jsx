import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { templates } from './templates';
import pkg from '../package.json';
import Papa from 'papaparse';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';

// --- Sub-Components ---
import AccessGate from './components/AccessGate';
import MainHeader from './components/MainHeader';
import Sidebar from './components/Sidebar';
import EditorPane from './components/EditorPane';
import PreviewPane from './components/PreviewPane';
import BatchWorker from './components/BatchWorker';
import EditModal from './components/EditModal';

// --- Utils & Constants ---
import { UI_STRINGS, CURRENCY_FIELDS, REQUIRED_FIELDS } from './constants/uiStrings';
import { USER_CONFIG } from './constants/userConfig';
import { sanitizeFilename } from './utils/helpers';
import { version as pkgVersion } from '../package.json';

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

// ── Main App ──────────────────────────────────────────────────────────────────
function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [formData, setFormData] = useState({});
  const [lang, setLang] = useState('zh');
  const [exporting, setExporting] = useState(false);
  const [editorCollapsed, setEditorCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uiLang, setUiLang] = useState('zh');
  const [expandedCats, setExpandedCats] = useState([]);
  const [editorWidth, setEditorWidth] = useState(550);
  const [isResizing, setIsResizing] = useState(false);
  const [staffId, setStaffId] = useState(localStorage.getItem('hr_staff_id') || '');
  const [userName, setUserName] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [role, setRole] = useState(null);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState('');

  // --- 自动更新检测逻辑 ---
  useEffect(() => {
    const checkUpdate = async () => {
      try {
        // 使用更通用的 GitHub Raw 地址
        const response = await fetch('https://raw.githubusercontent.com/jhlbxx/employment_letter/main/package.json');
        if (!response.ok) return;
        const data = await response.json();

        // 只有当远程版本号存在且与本地不一致时才提醒
        if (data.version && data.version !== pkg.version) {
          setRemoteVersion(data.version);
          setHasUpdate(true);
        }
      } catch (err) {
        // 离线或 URL 错误时保持沉默，不打扰用户
      }
    };

    // 启动 3 秒后静默检查
    const timer = setTimeout(checkUpdate, 3000);
    return () => clearTimeout(timer);
  }, []);

  const roleLabel = {
    admin: { zh: '系统管理员', en: 'System Admin' },
    recruitment: { zh: '招聘专员', en: 'Recruitment Specialist' },
    legal: { zh: '法务专员', en: 'Legal Specialist' },
    'employment relations': { zh: '员工关系专员', en: 'ER Specialist' }
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    if (!staffId.trim() || !accessCode.trim()) return;

    // Find matching user in config
    const user = USER_CONFIG.find(u =>
      u.staffId === staffId.trim() && u.accessCode === accessCode.trim()
    );

    if (user) {
      setRole(user.role);
      setUserName(user.name);
      setIsAuthorized(true);
      localStorage.setItem('hr_staff_id', staffId);
    } else {
      alert(uiLang === 'zh' ? '工号或准入码错误，请重新核对！' : 'Invalid ID or Access Code. Please check again!');
    }
  };

  const logout = () => {
    if (window.confirm(uiLang === 'zh' ? '确定要退出系统吗？' : 'Are you sure you want to logout?')) {
      setIsAuthorized(false);
      setAccessCode('');
      setRole(null);
    }
  };

  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  // Batch Mode States
  const [batchMode, setBatchMode] = useState(false);
  const [batchData, setBatchData] = useState([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [currentBatchItem, setCurrentBatchItem] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const BATCH_PAGE_SIZE = 5;

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecordIdx, setEditingRecordIdx] = useState(null);
  const [editingData, setEditingData] = useState({});

  const letterRef = useRef();
  const batchWorkerRef = useRef();

  // --- Resizing Logic ---
  useEffect(() => {
    const resize = (e) => {
      if (isResizing) {
        // 侧边栏宽度：展开时 280px，收起时拉手 32px
        const sidebarWidth = sidebarCollapsed ? 32 : 280;
        const newWidth = e.clientX - sidebarWidth;
        
        if (newWidth > 300 && newWidth < 800) {
          setEditorWidth(newWidth);
        }
      }
    };
    const stopResizing = () => setIsResizing(false);
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  useEffect(() => {
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  useEffect(() => {
    if (!selectedTemplate?.fields) return;
    const next = {};
    selectedTemplate.fields.forEach((f) => {
      next[f.id] = formData[f.id] ?? '';
    });
    setFormData(next);
  }, [selectedTemplate]);

  const handleChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // --- Handlers ---
  const downloadExcelTemplate = () => {
    const headers = [];
    selectedTemplate.fields.forEach(f => {
      if (f.bilingual) {
        headers.push(`${f.label[uiLang]} (ZH)`);
        headers.push(`${f.label[uiLang]} (EN)`);
      } else {
        headers.push(f.label[uiLang]);
      }
    });
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const colFormats = [];
    selectedTemplate.fields.forEach(f => {
      const fmt = CURRENCY_FIELDS.includes(f.id) ? { z: '#,##0.00' } : (f.type === 'date' ? { z: 'yyyy-mm-dd' } : { z: '@' });
      if (f.bilingual) {
        colFormats.push({ ...fmt, wpx: 120 });
        colFormats.push({ ...fmt, wpx: 120 });
      } else {
        colFormats.push({ ...fmt, wpx: 120 });
      }
    });
    ws['!cols'] = colFormats;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${selectedTemplate.name[uiLang]}_Template.xlsx`);
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      const mappedData = data.map(row => {
        const rowData = {};
        const formatExcelVal = (val) => (val instanceof Date ? val.toISOString().split('T')[0] : (val ?? ''));
        selectedTemplate.fields.forEach(f => {
          if (f.bilingual) {
            const labelZh = `${f.label[uiLang]} (ZH)`;
            const labelEn = `${f.label[uiLang]} (EN)`;
            rowData[f.id + '_zh'] = formatExcelVal(row[labelZh] || row[f.label[uiLang]]);
            rowData[f.id + '_en'] = formatExcelVal(row[labelEn] || row[f.label[uiLang]]);
            rowData[f.id] = rowData[f.id + '_zh'] || rowData[f.id + '_en'] || '';
          } else {
            rowData[f.id] = formatExcelVal(row[f.label[uiLang]]);
          }
        });
        return rowData;
      });
      setBatchData(mappedData);
      setPreviewIndex(0);
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
        setCurrentBatchItem(row);
        await new Promise(resolve => setTimeout(resolve, 300));
        const opt = {
          margin: 0, image: { type: 'jpeg', quality: 0.98 },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        const blob = await html2pdf().from(batchWorkerRef.current).set(opt).output('blob');
        const fileName = sanitizeFilename(`${row.employeeName || 'Employee'} - Daves Fish and Chips - ${selectedTemplate.name[uiLang]}.pdf`);
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
    if (!formData.employeeName || formData.employeeName.trim() === '') {
      alert(uiLang === 'zh' ? '无法导出：请输入收信人姓名！' : 'Cannot export: Please enter the Recipient Name!');
      return;
    }
    setExporting(true);
    try {
      const finalFilename = sanitizeFilename(`${formData.employeeName} - Daves fish and ships - ${selectedTemplate.name[uiLang]}.pdf`);
      await html2pdf().set({
        margin: 0, filename: finalFilename, image: { type: 'jpeg', quality: 1.0 },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        html2canvas: { scale: 3, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      }).from(letterRef.current).save();
    } catch (err) {
      alert('PDF 导出失败：' + err.message);
    } finally {
      setExporting(false);
    }
  };

  const saveEdit = () => {
    const missing = selectedTemplate.fields.filter(f => REQUIRED_FIELDS.includes(f.id) && !editingData[f.id]);
    if (missing.length > 0) {
      alert(uiLang === 'zh' ? '请填写必填项' : 'Please fill required fields');
      return;
    }
    const newData = [...batchData];
    if (editingRecordIdx === 'new') newData.push(editingData);
    else newData[editingRecordIdx] = editingData;
    setBatchData(newData);
    setIsEditModalOpen(false);
  };

  // --- Rendering ---
  if (!isAuthorized) {
    return (
      <AccessGate
        uiLang={uiLang} setUiLang={setUiLang}
        staffId={staffId} setStaffId={setStaffId}
        accessCode={accessCode} setAccessCode={setAccessCode}
        handleLogin={handleLogin} pkgVersion={pkg.version}
        hasUpdate={hasUpdate}
        remoteVersion={remoteVersion}
      />
    );
  }

  return (
    <div className="app-container" style={{ 
      display: 'flex', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden', 
      background: '#f8fafc',
      userSelect: isResizing ? 'none' : 'auto' 
    }}>
          {sidebarCollapsed && (
            <div className="expand-handle sidebar-handle" onClick={() => setSidebarCollapsed(false)}>
              <ChevronRight size={16} />
              <span className="vertical-text" style={{ 
                writingMode: 'vertical-rl', fontSize: '0.65rem', fontWeight: 700, 
                color: '#64748b', marginTop: '10px', letterSpacing: '0.1em' 
              }}>
                {uiLang === 'zh' ? '展开模板' : 'TEMPLATES'}
              </span>
            </div>
          )}
          <Sidebar 
            sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}
            selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate}
            role={role} uiLang={uiLang} setUiLang={setUiLang}
            expandedCats={expandedCats} setExpandedCats={setExpandedCats}
            verifyCode={verifyCode} setVerifyCode={setVerifyCode}
            verifyResult={verifyResult} setVerifyResult={setVerifyResult}
            pkgVersion={pkg.version}
            hasUpdate={hasUpdate}
            remoteVersion={remoteVersion}
          />

          {editorCollapsed && (
            <div className="expand-handle editor-handle" onClick={() => setEditorCollapsed(false)}>
              <ChevronRight size={16} />
              <span className="vertical-text" style={{ 
                writingMode: 'vertical-rl', fontSize: '0.65rem', fontWeight: 700, 
                color: '#64748b', marginTop: '10px', letterSpacing: '0.1em' 
              }}>
                {uiLang === 'zh' ? '展开编辑' : 'EDITOR'}
              </span>
            </div>
          )}
          <EditorPane 
            editorWidth={editorWidth} editorCollapsed={editorCollapsed} setEditorCollapsed={setEditorCollapsed}
            batchMode={batchMode} setBatchMode={setBatchMode}
            lang={lang} setLang={setLang}
            uiLang={uiLang}
            addNewBatchRecord={() => { setEditingRecordIdx('new'); setEditingData({}); setIsEditModalOpen(true); }}
            downloadExcelTemplate={downloadExcelTemplate} handleExcelUpload={handleExcelUpload}
            batchData={batchData} previewIndex={previewIndex} setPreviewIndex={setPreviewIndex}
            currentPage={currentPage} setCurrentPage={setCurrentPage} BATCH_PAGE_SIZE={BATCH_PAGE_SIZE}
            openEditModal={(idx) => { setEditingRecordIdx(idx); setEditingData({ ...batchData[idx] }); setIsEditModalOpen(true); }}
            removeBatchRecord={(idx) => setBatchData(batchData.filter((_, i) => i !== idx))}
            selectedTemplate={selectedTemplate} formData={formData} handleChange={handleChange}
            exportPDF={exportPDF} exporting={exporting} runBatchGeneration={runBatchGeneration}
            isProcessingBatch={isProcessingBatch} batchProgress={batchProgress}
          />

          {!editorCollapsed && (
            <div className="editor-resizer" onMouseDown={() => setIsResizing(true)} />
          )}

          <div className="right-workspace" style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, position: 'relative' }}>
            <MainHeader role={role} staffId={staffId} userName={userName} uiLang={uiLang} setUiLang={setUiLang} logout={logout} roleLabel={roleLabel} />
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <PreviewPane 
                selectedTemplate={selectedTemplate}
                formData={formData}
                staffId={staffId}
                uiLang={uiLang}
                lang={lang}
                batchMode={batchMode}
                batchData={batchData}
                previewIndex={previewIndex}
                setPreviewIndex={setPreviewIndex}
              />
            </div>
          </div>

          <BatchWorker
            batchWorkerRef={batchWorkerRef} staffId={staffId}
            selectedTemplate={selectedTemplate} currentBatchItem={currentBatchItem} lang={lang}
          />
          <EditModal
            isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen}
            uiLang={uiLang} selectedTemplate={selectedTemplate}
            editingData={editingData} setEditingData={setEditingData} saveEdit={saveEdit}
          />
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
