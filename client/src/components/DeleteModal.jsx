import React from 'react';

const DeleteModal = ({ isOpen, onClose, onConfirm, taskName = '', isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header" style={{ borderBottom: 'none', marginBottom: '12px' }}>
          <h2>Delete Task</h2>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '0.95rem' }}>
          Are you sure you want to delete this task?
        </p>

        {taskName && (
          <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '20px' }}>
            "{taskName}"
          </p>
        )}

        <div className="modal-footer" style={{ borderTop: 'none', paddingTop: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn-danger"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
