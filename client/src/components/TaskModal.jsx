import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSave, task = null, isSaving = false }) => {
  const isEditing = Boolean(task && task._id);

  const [formData, setFormData] = useState({
    taskName: '',
    description: '',
    progress: 0,
    status: 'Planned',
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        taskName: task.taskName || '',
        description: task.description || '',
        progress: task.progress !== undefined ? task.progress : 0,
        status: task.status || 'Planned',
      });
    } else {
      setFormData({
        taskName: '',
        description: '',
        progress: 0,
        status: 'Planned',
      });
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  // When status changes, automatically sync progress
  const handleStatusChange = (newStatus) => {
    let newProgress = formData.progress;
    if (newStatus === 'Complete') {
      newProgress = 100;
    } else if (newStatus === 'Planned') {
      newProgress = 0;
    } else if (newStatus === 'In Progress') {
      // If was 0 or 100, set to 50% as sensible in-progress default
      if (formData.progress === 0 || formData.progress === 100) {
        newProgress = 50;
      }
    }

    setFormData((prev) => ({
      ...prev,
      status: newStatus,
      progress: newProgress,
    }));
  };

  // When progress slider is moved in edit mode, sync status
  const handleProgressChange = (newProgress) => {
    const val = Math.min(Math.max(Number(newProgress), 0), 100);
    let newStatus = formData.status;
    if (val === 100) {
      newStatus = 'Complete';
    } else if (val === 0) {
      newStatus = 'Planned';
    } else {
      newStatus = 'In Progress';
    }

    setFormData((prev) => ({
      ...prev,
      progress: val,
      status: newStatus,
    }));
  };

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

    // Determine progress on create vs edit
    let finalProgress = Number(formData.progress);
    if (!isEditing) {
      if (formData.status === 'Complete') finalProgress = 100;
      else if (formData.status === 'In Progress') finalProgress = 50;
      else finalProgress = 0;
    }

    const payload = {
      taskName: formData.taskName.trim(),
      description: formData.description.trim(),
      progress: finalProgress,
      status: formData.status,
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
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
            </select>
          </div>

          {/* Progress bar/slider is ONLY shown in Edit mode and automatically adapts to status */}
          {isEditing && (
            <div className="form-group" style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label htmlFor="progress">
                  Progress: <strong>{formData.progress}%</strong>
                </label>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Auto-syncs with status ({formData.status})
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress}
                  onChange={(e) => handleProgressChange(e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => handleProgressChange(e.target.value)}
                  style={{ width: '70px', padding: '6px 8px', textAlign: 'center' }}
                />
              </div>
            </div>
          )}

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
