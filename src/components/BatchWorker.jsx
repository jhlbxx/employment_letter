import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Fish } from 'lucide-react';
import { renderTemplate } from '../utils/helpers';
import { generateSecurityCode } from '../utils/security';

export default function BatchWorker({
  batchWorkerRef,
  staffId,
  selectedTemplate,
  currentBatchItem,
  lang
}) {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
      <div className="letter-paper" ref={batchWorkerRef}>
        <header className="letter-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
            {/* Security QR Code - Absolute */}
            <div className="qr-security-box" style={{ position: 'absolute', bottom: '15px', right: '15px', textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <QRCodeSVG 
                value={generateSecurityCode(staffId, selectedTemplate.id, currentBatchItem || {})}
                size={50}
                level="L"
                includeMargin={true}
              />
              <span style={{ fontSize: '6px', color: '#cbd5e1', marginTop: '2px', fontFamily: 'monospace' }}>
                {generateSecurityCode(staffId, selectedTemplate.id, currentBatchItem || {}).substring(0, 6)}
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
  );
}
