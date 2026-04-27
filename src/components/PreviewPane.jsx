import React from 'react';
import { ChevronLeft, ChevronRight, Fish } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { UI_STRINGS } from '../constants/uiStrings';
import { renderTemplate } from '../utils/helpers';
import { generateSecurityCode } from '../utils/security';

export default function PreviewPane({
  letterRef,
  batchMode,
  batchData,
  previewIndex,
  setPreviewIndex,
  uiLang,
  selectedTemplate,
  formData,
  lang,
  staffId
}) {
  return (
    <section className="preview-pane">
      <div className="controls" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {batchMode && batchData.length > 0 && (
          <div className="batch-nav">
            <button 
              className="nav-btn" 
              disabled={previewIndex === 0}
              onClick={() => setPreviewIndex(p => Math.max(0, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="nav-info">
              {uiLang === 'zh' ? `第 ${previewIndex + 1} / ${batchData.length} 份` : `Letter ${previewIndex + 1} of ${batchData.length}`}
            </span>
            <button 
              className="nav-btn" 
              disabled={previewIndex === batchData.length - 1}
              onClick={() => setPreviewIndex(p => Math.min(batchData.length - 1, p + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="letter-paper" ref={letterRef}>
        <header className="letter-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            {/* Security QR Code - Absolute */}
            <div className="qr-security-box" style={{ position: 'absolute', bottom: '15px', right: '15px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <QRCodeSVG 
                value={generateSecurityCode(staffId, selectedTemplate.id, (batchMode && batchData.length > 0) ? batchData[previewIndex] : formData)}
                size={50}
                level="L"
                includeMargin={true}
              />
              <span style={{ fontSize: '6px', color: '#cbd5e1', marginTop: '2px', fontFamily: 'monospace' }}>
                {generateSecurityCode(staffId, selectedTemplate.id, (batchMode && batchData.length > 0) ? batchData[previewIndex] : formData).substring(0, 6)}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="logo-icon" style={{ 
                width: 32, height: 32, backgroundColor: '#2563eb', 
                borderRadius: 8, display: 'flex', alignItems: 'center', 
                justifyContent: 'center', marginRight: 12 
              }}>
                <Fish size={18} color="white" />
              </div>
              <div className="letter-logo-text">DAVE'S FISH &amp; CHIPS</div>
            </div>

            <div className="letter-contact-info">
              1234 Granville St, Vancouver, BC V6Z 1M4, Canada<br />
              Phone: +1 (604) 555-0199<br />
              Email: hr@dave-is-a-partner.ca<br />
              Website: www.daves-fish-chips.ca
            </div>
          </div>
        </header>

        {/* Letter Body */}
        <article className="letter-content">
          {lang === 'dual' ? (
            <>
              <div
                style={{ marginBottom: 40 }}
                dangerouslySetInnerHTML={{
                  __html: renderTemplate(selectedTemplate?.content?.en || '', (batchMode && batchData.length > 0) ? batchData[previewIndex] : formData, 'en', uiLang),
                }}
              />
              <div
                style={{ borderTop: '1px dashed #ddd', paddingTop: 40 }}
                dangerouslySetInnerHTML={{
                  __html: renderTemplate(selectedTemplate?.content?.zh || '', (batchMode && batchData.length > 0) ? batchData[previewIndex] : formData, 'zh', uiLang),
                }}
              />
            </>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: renderTemplate(selectedTemplate?.content?.[lang] || '', (batchMode && batchData.length > 0) ? batchData[previewIndex] : formData, lang, uiLang),
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
  );
}
