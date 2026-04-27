import React from 'react';
import { Fish, ChevronLeft, ChevronDown, Languages, ShieldCheck } from 'lucide-react';
import { templates } from '../templates';
import { UI_STRINGS } from '../constants/uiStrings';
import { decodeSecurityCode } from '../utils/security';

export default function Sidebar({
  sidebarCollapsed,
  setSidebarCollapsed,
  selectedTemplate,
  setSelectedTemplate,
  role,
  uiLang,
  setUiLang,
  expandedCats,
  setExpandedCats,
  verifyCode,
  setVerifyCode,
  verifyResult,
  setVerifyResult,
  pkgVersion
}) {
  return (
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


      <nav className="template-list">
        <div className="template-section-label">{UI_STRINGS[uiLang].templates}</div>

        {[
          { id: 'employment', label: UI_STRINGS[uiLang].catEmployment },
          { id: 'notice', label: UI_STRINGS[uiLang].catNotice },
          { id: 'termination', label: UI_STRINGS[uiLang].catTermination },
        ].filter(cat => {
          if (role === 'admin') return true;
          if (role === 'recruitment') return cat.id === 'employment';
          if (role === 'legal' || role === 'employment relations') return cat.id === 'notice' || cat.id === 'termination';
          return false;
        }).map((cat) => {
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
        {/* Security Decoder Tool (Admin Only) */}
        {role === 'admin' && (
          <div className="decoder-tool" style={{
            background: '#f8fafc',
            padding: '10px',
            borderRadius: '8px',
            border: '1px dashed #cbd5e1',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#475569', fontWeight: 700, fontSize: '0.7rem' }}>
              <ShieldCheck size={14} /> {uiLang === 'zh' ? '防伪验证' : 'Authenticity Verification'}
            </div>
            <input
              type="text"
              placeholder={uiLang === 'zh' ? "粘贴防伪码进行核验..." : "Paste security code..."}
              value={verifyCode}
              onChange={(e) => {
                const val = e.target.value;
                setVerifyCode(val);
                if (val) setVerifyResult(decodeSecurityCode(val));
                else setVerifyResult(null);
              }}
              style={{
                width: '100%',
                fontSize: '0.65rem',
                padding: '5px',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                marginBottom: '8px'
              }}
            />
            {verifyResult ? (
              <div style={{
                fontSize: '0.6rem',
                background: '#f0fdf4',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #bbf7d0',
                color: '#166534'
              }}>
                <div style={{ fontWeight: 800, marginBottom: '6px', borderBottom: '1px solid #bbf7d0', paddingBottom: '4px' }}>
                  ✅ {uiLang === 'zh' ? '核验通过' : 'VERIFIED'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <div>{uiLang === 'zh' ? 'HR工号' : 'HR ID'}: <strong>{verifyResult.staffId}</strong></div>
                  <div>{uiLang === 'zh' ? '收信人' : 'Recipient'}: <strong>{verifyResult.employeeName}</strong></div>
                  <div style={{ marginTop: '4px' }}>
                    {uiLang === 'zh' ? '核定薪资' : 'Approved Salary'}:
                    <div style={{ paddingLeft: '8px', marginTop: '2px', color: '#166534', fontSize: '0.55rem' }}>
                      {verifyResult.salary.split('; ').map((item, idx) => {
                        const [key, val] = item.split(':');
                        const labelMap = {
                          salary: { zh: '年薪', en: 'Annual Salary' },
                          monthlyBase: { zh: '月基本工资', en: 'Monthly Base' },
                          annualBonus: { zh: '年终奖金', en: 'Annual Bonus' },
                          statutoryComp: { zh: '法定赔偿金', en: 'Statutory Comp' },
                          extraComp: { zh: '额外赔偿金', en: 'Extra Comp' },
                          probationSalary: { zh: '试用期薪资', en: 'Probation Salary' }
                        };
                        const label = labelMap[key] ? labelMap[key][uiLang] : key;
                        return <div key={idx}>• {label}: <strong>{val}</strong></div>;
                      })}
                    </div>
                  </div>
                  <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed #bbf7d0' }}>
                    {uiLang === 'zh' ? '制作时间' : 'Created At'}: <br />
                    <strong>{new Date(verifyResult.time).toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            ) : verifyCode && (
              <div style={{
                fontSize: '0.65rem',
                color: '#ef4444',
                background: '#fef2f2',
                padding: '8px',
                borderRadius: '4px',
                textAlign: 'center',
                border: '1px solid #fecaca',
                fontWeight: 700
              }}>
                ⚠️ {uiLang === 'zh' ? '该雇主信可能是伪造！' : 'This letter might be FORGED!'}
              </div>
            )}
          </div>
        )}

        <div className="version-info">
          {UI_STRINGS[uiLang].version}: v{pkgVersion}
        </div>
        <div className="version-info" style={{ marginTop: '4px' }}>
          {UI_STRINGS[uiLang].updated}: 2026-04-25
        </div>
      </div>
    </aside>
  );
}
