import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
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

      {/* Footer / Meta */}
      <div className="task-card-footer">
        <div className="task-meta">
          <span>
            Status: <span style={{ fontWeight: 600 }}>{task.status}</span>
          </span>
          {task.progress !== undefined && (
            <span>
              Progress: <span style={{ fontWeight: 600 }}>{task.progress}%</span>
            </span>
          )}
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
