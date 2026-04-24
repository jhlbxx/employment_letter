import React, { useState, useEffect, useRef } from 'react';
import { templates } from './templates';
import { Fish, Download, Printer } from 'lucide-react';

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
          html2canvas: { scale: 4, useCORS: true, letterRendering: true },
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
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon"><Fish size={22} /></div>
          <div className="company-name">DAVE'S<br />FISH &amp; CHIPS</div>
        </div>

        <nav className="template-list">
          <div className="template-section-label">Templates / 模板</div>
          {templates.map((t) => (
            <div
              key={t.id}
              id={`template-${t.id}`}
              className={`template-item ${selectedTemplate?.id === t.id ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(t)}
            >
              <div className="template-name">{t.name[sl]}</div>
              <div className="template-desc">{t.description[sl]}</div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">

        {/* Editor */}
        <section className="editor-pane">
          <div className="editor-header">
            <h2>Editor / 编辑</h2>
          </div>

          <div className="lang-toggle">
            {[['zh', '中文'], ['en', 'English'], ['dual', '中英对照']].map(([key, label]) => (
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
                  {lang === 'en' ? field.label.en : field.label.zh}
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
              {exporting ? '导出中…' : 'Export PDF / 导出 PDF'}
            </button>
          </div>
        </section>

        {/* Preview */}
        <section className="preview-pane">
          <div className="controls">
            <button id="btn-print" className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print / 打印
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
