import { X, Languages } from 'lucide-react';

export default function MainHeader({ 
  role, 
  staffId, 
  userName,
  uiLang, 
  setUiLang,
  logout, 
  roleLabel 
}) {
  return (
    <header className="main-header" style={{ justifyContent: 'flex-end', paddingRight: '20px' }}>
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        
        {/* UI Language Switcher in Header */}
        <div className="header-lang-toggle" style={{ 
          display: 'flex', 
          background: '#f1f5f9', 
          padding: '2px', 
          borderRadius: '6px',
          border: '1px solid #e2e8f0'
        }}>
          <button 
            onClick={() => setUiLang('zh')}
            style={{
              padding: '2px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: uiLang === 'zh' ? 'white' : 'transparent',
              color: uiLang === 'zh' ? '#0f172a' : '#64748b',
              boxShadow: uiLang === 'zh' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontWeight: uiLang === 'zh' ? 700 : 500
            }}
          >中</button>
          <button 
            onClick={() => setUiLang('en')}
            style={{
              padding: '2px 8px',
              fontSize: '0.75rem',
              borderRadius: '4px',
              border: 'none',
              background: uiLang === 'en' ? 'white' : 'transparent',
              color: uiLang === 'en' ? '#0f172a' : '#64748b',
              boxShadow: uiLang === 'en' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              cursor: 'pointer',
              fontWeight: uiLang === 'en' ? 700 : 500
            }}
          >EN</button>
        </div>

        <div className="user-welcome-text" style={{ fontSize: '0.85rem', color: '#64748b' }}>
          {uiLang === 'zh' ? (
            <>欢迎 <strong>{userName}</strong> ({staffId})！当前系统角色：<strong>{roleLabel[role][uiLang]}</strong></>
          ) : (
            <>Welcome <strong>{userName}</strong> ({staffId})! Role: <strong>{roleLabel[role][uiLang]}</strong></>
          )}
        </div>
        
        <button className="logout-btn-top" onClick={logout}>
          <X size={16} />
          <span>{uiLang === 'zh' ? '退出系统' : 'Logout'}</span>
        </button>
      </div>
    </header>
  );
}
