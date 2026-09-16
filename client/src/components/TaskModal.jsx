import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null, isSaving = false }) => {
  const isEditing = Boolean(task && task._id);

  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    status: 'Planned',
    dueDate: '',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.taskName || '',
        description: task.description || '',
        status: task.status || 'Planned',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({
        taskName: '',
        description: '',
        status: 'Planned',
        dueDate: '',
      });
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.taskName.trim()) {
      setError('Task name is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    let autoProgress = 0;
    if (formData.status === 'Complete') {
      autoProgress = 100;
    } else if (formData.status === 'In Progress') {
      autoProgress = 50;
    } else {
      autoProgress = 0;
    }

    const payload = {
      taskName: formData.taskName.trim(),
      description: formData.description.trim(),
      progress: autoProgress,
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
          <button onClick={onClose} className="btn-text" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="taskName">Task Name *</label>
            <input
              id="taskName"
              type="text"
              placeholder="e.g., Complete MERN Project"
              value={formData.taskName}
              onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Brief description of the task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date (Optional)</label>
            <input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
              You will receive an automated Gmail reminder 1 day before this deadline.
            </span>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
