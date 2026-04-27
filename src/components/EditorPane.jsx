import React from 'react';
import { ChevronLeft, FileText, Table, Plus, Download, Upload, CheckCircle2, Edit2, Trash2, ChevronRight, Loader2 } from 'lucide-react';
import { UI_STRINGS, CURRENCY_FIELDS, REQUIRED_FIELDS, UNIT_FIELDS } from '../constants/uiStrings';
import { formatToCurrency, formatForInput } from '../utils/helpers';

export default function EditorPane({
  editorWidth,
  editorCollapsed,
  setEditorCollapsed,
  batchMode,
  setBatchMode,
  lang,
  setLang,
  uiLang,
  addNewBatchRecord,
  downloadExcelTemplate,
  handleExcelUpload,
  batchData,
  previewIndex,
  setPreviewIndex,
  currentPage,
  setCurrentPage,
  BATCH_PAGE_SIZE,
  openEditModal,
  removeBatchRecord,
  selectedTemplate,
  formData,
  handleChange,
  exportPDF,
  exporting,
  runBatchGeneration,
  isProcessingBatch,
  batchProgress
}) {
  return (
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

      <div className="lang-section" style={{ marginBottom: '24px' }}>
        <div className="section-label">{UI_STRINGS[uiLang].letterLangLabel}</div>
        <div className="lang-toggle">
          {[
            ['zh', UI_STRINGS[uiLang].langZh], 
            ['en', UI_STRINGS[uiLang].langEn], 
            ['dual', UI_STRINGS[uiLang].langDual]
          ].map(([l, label]) => (
            <button
              key={l}
              className={`lang-btn ${lang === l ? 'active' : ''}`}
              onClick={() => setLang(l)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {batchMode ? (
        <div className="batch-editor">
          <div className="batch-actions">
            <button className="btn btn-secondary" onClick={addNewBatchRecord}>
              <Plus size={14} /> {UI_STRINGS[uiLang].addRecord}
            </button>
            <button className="btn btn-secondary" onClick={downloadExcelTemplate}>
              <Download size={14} /> {UI_STRINGS[uiLang].downloadTemplate}
            </button>
            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={14} /> {UI_STRINGS[uiLang].uploadCsv}
              <input 
                id="excel-upload"
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleExcelUpload} 
                style={{ display: 'none' }} 
              />
            </label>
          </div>

          {batchData.length > 0 && (
            <div className="batch-status-card compact">
              <CheckCircle2 size={16} color="#10b981" />
              <strong>{UI_STRINGS[uiLang].batchSummary.replace('{count}', batchData.length)}</strong>
            </div>
          )}

          <div className="batch-preview-table">
            <table>
              <thead>
                <tr>
                  {selectedTemplate.fields.map(f => (
                    <th key={f.id} title={f.label[uiLang]}>
                      {f.label[uiLang]}
                    </th>
                  ))}
                  <th className="sticky-action-col">{uiLang === 'zh' ? '操作' : 'Action'}</th>
                </tr>
              </thead>
              <tbody>
                {batchData.length > 0 ? (
                  batchData.slice(currentPage * BATCH_PAGE_SIZE, (currentPage + 1) * BATCH_PAGE_SIZE).map((row, idx) => {
                    const globalIdx = currentPage * BATCH_PAGE_SIZE + idx;
                    return (
                      <tr 
                        key={globalIdx} 
                        onClick={() => setPreviewIndex(globalIdx)}
                        className={previewIndex === globalIdx ? 'active-row' : ''}
                        style={{ cursor: 'pointer' }}
                      >
                        {selectedTemplate.fields.map(f => {
                          const val = row[f.id];
                          const isCurrency = CURRENCY_FIELDS.includes(f.id);
                          const displayVal = isCurrency && val ? formatToCurrency(val) : (val || '-');
                          return <td key={f.id} title={displayVal.toString()}>{displayVal}</td>;
                        })}
                        <td className="sticky-action-col">
                          <div className="action-btns">
                            <button 
                              className="action-btn edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(globalIdx);
                              }}
                              title={uiLang === 'zh' ? "编辑" : "Edit"}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              className="action-btn delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBatchRecord(globalIdx);
                              }}
                              title={uiLang === 'zh' ? "移除" : "Remove"}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={selectedTemplate.fields.length + 1} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                      <div className="batch-empty-hint">
                        <div className="empty-icon-wrapper">
                          <Table size={48} />
                        </div>
                        <h3>{UI_STRINGS[uiLang].batchEmpty}</h3>
                        <p className="action-guide">
                          {uiLang === 'zh' ? '您可以 ' : 'You can '}
                          <button className="text-link-btn" onClick={downloadExcelTemplate}>
                            {UI_STRINGS[uiLang].downloadTemplate}
                          </button>
                          {uiLang === 'zh' ? ' 填写后 ' : ' then '}
                          <button className="text-link-btn" onClick={() => document.getElementById('excel-upload').click()}>
                            {UI_STRINGS[uiLang].uploadData}
                          </button>
                          {uiLang === 'zh' ? '，或直接 ' : ', or directly '}
                          <button className="text-link-btn" onClick={addNewBatchRecord}>
                            {UI_STRINGS[uiLang].addRecord}
                          </button>
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {batchData.length > BATCH_PAGE_SIZE && (
            <div className="batch-pagination">
              <button 
                className="page-btn" 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="page-info">
                {uiLang === 'zh' ? `第 ${currentPage + 1} / ${Math.ceil(batchData.length / BATCH_PAGE_SIZE)} 页` : `Page ${currentPage + 1} of ${Math.ceil(batchData.length / BATCH_PAGE_SIZE)}`}
              </span>
              <button 
                className="page-btn" 
                disabled={(currentPage + 1) * BATCH_PAGE_SIZE >= batchData.length}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="fields-container">
          {selectedTemplate?.fields.map((field) => (
            <div key={field.id} className="form-group">
              <label htmlFor={'field-' + field.id}>
                {field.label[uiLang]}
                {REQUIRED_FIELDS.includes(field.id) ? (
                  <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                ) : (
                  ` (${uiLang === 'zh' ? '可选' : 'Optional'})`
                )}
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

      {/* Editor Footer (Sticky) */}
      <div className="editor-footer">
        {!batchMode ? (
          <button
            id="btn-export-pdf"
            className="btn btn-primary"
            onClick={exportPDF}
            disabled={exporting}
            style={{ width: '100%' }}
          >
            <Download size={16} />
            {exporting ? (UI_STRINGS[uiLang]?.exporting || '...') : (UI_STRINGS[uiLang]?.exportBtn || 'Export')}
          </button>
        ) : (
          (batchData && batchData.length > 0) && (
            <button 
              className="btn btn-primary" 
              onClick={runBatchGeneration}
              disabled={isProcessingBatch}
              style={{ width: '100%' }}
            >
              {isProcessingBatch ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> 
                  {uiLang === 'zh' 
                    ? `正在生成第 ${batchProgress.current}/${batchProgress.total} 份...`
                    : `Generating ${batchProgress.current}/${batchProgress.total}...`}
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} /> 
                  {(UI_STRINGS[uiLang]?.startBatch || 'Start Batch')}
                </>
              )}
            </button>
          )
        )}
      </div>
    </section>
  );
}
