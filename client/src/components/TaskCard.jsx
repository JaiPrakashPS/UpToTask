import React from 'react';
import { Edit3, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  // Generate ASCII block progress bar (20 characters total)
  const totalBlocks = 20;
  const filledBlocks = Math.round(((task.progress || 0) / 100) * totalBlocks);
  const emptyBlocks = totalBlocks - filledBlocks;
  const blockString = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Planned':
        return 'planned';
      case 'In Progress':
        return 'in-progress';
      case 'Complete':
        return 'complete';
      default:
        return '';
    }
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{task.taskName}</h3>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className={`status-badge ${getStatusClass(task.status)}`}
          style={{ width: 'auto', padding: '4px 8px', cursor: 'pointer', appearance: 'auto' }}
          title="Change Status"
        >
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
      </div>

      <p className="task-card-desc">{task.description}</p>

      {/* Progress Section */}
      <div className="progress-section">
        <div className="progress-header">
          <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
          <span className="progress-pct">{task.progress}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${Math.min(Math.max(task.progress || 0, 0), 100)}%` }}
          />
        </div>
        <div className="progress-block-rep" title={`${task.progress}%`}>
          {blockString}
        </div>
      </div>

      {/* Footer / Meta */}
      <div className="task-card-footer">
        <div className="task-meta">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={14} />
            Duration: <strong className="task-duration">{task.duration?.value} {task.duration?.unit}</strong>
          </span>
          <span>
            Status: <span style={{ fontWeight: 600 }}>{task.status}</span>
          </span>
        </div>

        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
          >
            <Edit3 size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(task)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.82rem', borderColor: '#DDDDDD' }}
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
