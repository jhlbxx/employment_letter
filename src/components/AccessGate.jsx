import React, { useState } from 'react';
import { Fish, Eye, EyeOff } from 'lucide-react';

export default function AccessGate({ 
  uiLang, 
  setUiLang, 
  handleLogin, 
  pkgVersion,
  hasUpdate,
  remoteVersion
}) {
  const [localStaffId, setLocalStaffId] = useState('');
  const [localAccessCode, setLocalAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleLogin(localStaffId, localAccessCode);
  };

  return (
    <div className="access-gate">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Fish size={40} color="#3b82f6" />
          </div>
          <h1>DAVE'S FISH & CHIPS</h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <p style={{ margin: 0 }}>{uiLang === 'zh' ? 'HR标准信函生成系统' : 'HR Standard Letter Generation System'} v{pkgVersion}</p>
            {hasUpdate && (
              <span style={{ 
                background: '#f97316', 
                color: 'white', 
                padding: '1px 6px', 
                borderRadius: '4px', 
                fontSize: '0.65rem', 
                fontWeight: 900,
                cursor: 'default',
                animation: 'pulse 2s infinite'
              }}>
                UPDATE v{remoteVersion}
              </span>
            )}
          </div>
        </div>
        
        <form onSubmit={onFormSubmit}>
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ margin: 0 }}>{uiLang === 'zh' ? 'W3 工号' : 'W3 ID'}</label>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                <span 
                  onClick={() => setUiLang('zh')} 
                  style={{ 
                    color: uiLang === 'zh' ? '#2563eb' : '#94a3b8', 
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                >中文</span>
                <span style={{ margin: '0 6px', color: '#e2e8f0', fontWeight: 'normal' }}>|</span>
                <span 
                  onClick={() => setUiLang('en')} 
                  style={{ 
                    color: uiLang === 'en' ? '#2563eb' : '#94a3b8', 
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                >English</span>
              </div>
            </div>
            <input 
              required 
              type="text" 
              placeholder="e.g. 007" 
              autoComplete="off"
              value={localStaffId} 
              onChange={(e) => setLocalStaffId(e.target.value)} 
              style={{ pointerEvents: 'auto' }}
            />
          </div>
          <div className="input-group">
            <label>{uiLang === 'zh' ? '工具准入码' : 'Tool Access Code'}</label>
            <div style={{ position: 'relative' }}>
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                className={uiLang === 'en' ? 'en-placeholder' : ''}
                placeholder={uiLang === 'zh' ? "非W3登录密码，请联系Dave Jia获取" : "NOT W3 password, contact Dave Jia for access code"} 
                autoComplete="off"
                value={localAccessCode} 
                onChange={(e) => setLocalAccessCode(e.target.value)} 
                style={{ paddingRight: '45px', pointerEvents: 'auto' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="login-btn">
            {uiLang === 'zh' ? '进入工作空间' : 'Enter Workspace'}
          </button>
        </form>
      </div>
    </div>
  );
}
