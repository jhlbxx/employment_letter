import React, { useState, useEffect, useRef } from 'react';
import { templates } from './templates';
import { Fish, Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import pkg from '../package.json';
import { Languages } from 'lucide-react';

const UI_STRINGS = {
  zh: {
    templates: "Templates / 模板",
    editor: "Editor / 编辑",
    langZh: "仅中文",
    langEn: "仅英文",
    langDual: "中英对照",
    exportBtn: "Export PDF / 导出 PDF",
    exporting: "导出中…",
    printBtn: "Print / 打印",
    version: "Version / 版本",
    updated: "Last Updated / 更新日期",
    uiLangLabel: "界面语言 / Language",
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
  }
};

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
function renderTemplate(contentTemplate, formData) {
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
    const val = formData[key]
      ? formData[key]
      : `<span style="color:#aaa">[ ${key} ]</span>`;
    out = out.split(`{{${key}}}`).join(val);
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
  const letterRef = useRef();

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

  const exportPDF = async () => {
    if (!letterRef.current || exporting) return;
    setExporting(true);
    try {
      // Lazy-load html2pdf only when needed to avoid import-time crashes
      const html2pdf = (await import('html2pdf.js')).default;
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
          {templates.map((t) => (
            <div
              key={t.id}
              id={`template-${t.id}`}
              className={`template-item ${selectedTemplate?.id === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(t)}
            >
              <div className="template-name">{t.name[uiLang]}</div>
              <div className="template-desc">{t.description[uiLang]}</div>
            </div>
          ))}
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
            title="Expand Sidebar / 展开侧边栏"
          >
            <ChevronRight size={16} />
          </div>
        )}

        {/* Editor */}
        <section className={`editor-pane ${editorCollapsed ? 'collapsed' : ''}`}>
          <div className="editor-header">
            <h2>{UI_STRINGS[uiLang].editor}</h2>
            <button
              className="toggle-editor-btn"
              onClick={() => setEditorCollapsed(true)}
              title={uiLang === 'zh' ? "收起编辑" : "Collapse Editor"}
            >
              <ChevronLeft size={20} />
            </button>
          </div>

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

          <div className="fields-container">
            {selectedTemplate?.fields.map((field) => (
              <div key={field.id} className="form-group">
                <label htmlFor={`field-${field.id}`}>
                  {field.label[uiLang]}
                </label>
                <input
                  id={`field-${field.id}`}
                  type={field.type || 'text'}
                  placeholder={field.placeholder || ''}
                  value={formData[field.id] ?? ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              </div>
            ))}
          </div>

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

        {/* Preview */}
        <section className="preview-pane">
          {editorCollapsed && (
            <div
              className="expand-handle"
              onClick={() => setEditorCollapsed(false)}
              title={uiLang === 'zh' ? "展开编辑" : "Expand Editor"}
            >
              <ChevronRight size={16} />
            </div>
          )}
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
                      __html: renderTemplate(selectedTemplate?.content?.en || '', formData),
                    }}
                  />
                  <div
                    style={{ borderTop: '1px dashed #ddd', paddingTop: 40 }}
                    dangerouslySetInnerHTML={{
                      __html: renderTemplate(selectedTemplate?.content?.zh || '', formData),
                    }}
                  />
                </>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderTemplate(selectedTemplate?.content?.[lang] || '', formData),
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
