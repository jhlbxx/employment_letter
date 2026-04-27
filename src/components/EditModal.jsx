import React from 'react';
import { X } from 'lucide-react';

export default function EditModal({
  isEditModalOpen,
  setIsEditModalOpen,
  uiLang,
  selectedTemplate,
  editingData,
  setEditingData,
  saveEdit
}) {
  if (!isEditModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{uiLang === 'zh' ? '编辑数据' : 'Edit Record'}</h3>
          <button className="close-btn" onClick={() => setIsEditModalOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="edit-grid">
            {selectedTemplate.fields.map(f => (
              <div key={f.id} className="edit-field">
                <label>
                  {f.label[uiLang]}
                  {f.id === 'employeeName' || f.id === 'role' || f.id === 'startDate' ? (
                    <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                  ) : (
                    ` (${uiLang === 'zh' ? '可选' : 'Optional'})`
                  )}
                </label>
                <input 
                  type={f.type === 'date' ? 'date' : 'text'}
                  value={editingData[f.id] || ''}
                  onChange={(e) => setEditingData({ ...editingData, [f.id]: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
            {uiLang === 'zh' ? '取消' : 'Cancel'}
          </button>
          <button className="btn btn-primary" onClick={saveEdit}>
            {uiLang === 'zh' ? '保存修改' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
