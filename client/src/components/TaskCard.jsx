import React from 'react';
import { Edit3, Trash2, Calendar } from 'lucide-react';

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

  // Due date formatting & urgency calculations
  let formattedDue = null;
  let dueAlert = null;
  if (task.dueDate) {
    const dueDateObj = new Date(task.dueDate);
    formattedDue = dueDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (task.status !== 'Complete') {
      const now = Date.now();
      const diffHours = (dueDateObj.getTime() - now) / (1000 * 60 * 60);
      if (diffHours < 0) {
        dueAlert = (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#000000',
              border: '1px solid #000000',
              padding: '1px 6px',
              borderRadius: '3px',
              textTransform: 'uppercase',
            }}
          >
            Overdue
          </span>
        );
      } else if (diffHours <= 24) {
        dueAlert = (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              backgroundColor: '#EEEEEE',
              color: '#000000',
              border: '1px solid #888888',
              padding: '1px 6px',
              borderRadius: '3px',
            }}
            title="Gmail reminder will be pushed 1 day before deadline"
          >
            Due in 1 Day
          </span>
        );
      }
    }
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h3 className="task-card-title">{task.taskName}</h3>
          {dueAlert}
        </div>
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
        <div className="task-meta" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <span>
            Status: <span style={{ fontWeight: 600 }}>{task.status}</span>
          </span>

          {formattedDue && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={13} />
              Due: <span style={{ fontWeight: 600 }}>{formattedDue}</span>
            </span>
          )}

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
