import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import DeleteModal from '../components/DeleteModal';
import { Plus, Search, X } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch user tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/tasks');
      if (res.data.success) {
        setTasks(res.data.tasks || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle open Create Task modal
  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  // Handle open Edit Task modal
  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle save task (Create or Edit)
  const handleSaveTask = async (taskData) => {
    try {
      setIsSaving(true);
      setError('');

      if (editingTask) {
        // Update existing task
        const res = await api.put(`/tasks/${editingTask._id}`, taskData);
        if (res.data.success) {
          setTasks((prev) =>
            prev.map((t) => (t._id === editingTask._id ? res.data.task : t))
          );
        }
      } else {
        // Create new task
        const res = await api.post('/tasks', taskData);
        if (res.data.success) {
          setTasks((prev) => [res.data.task, ...prev]);
        }
      }

      setIsTaskModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle open delete modal
  const handleOpenDelete = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete task
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      setError('');
      const res = await api.delete(`/tasks/${taskToDelete._id}`);
      if (res.data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      }
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick Status change directly from Task Card
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      if (res.data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? res.data.task : t))
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task status.');
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'All' || task.status === filter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      (task.taskName && task.taskName.toLowerCase().includes(query)) ||
      (task.description && task.description.toLowerCase().includes(query));
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Navbar />

      <main className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h2>Tasks</h2>
            <p>Track, manage, and complete your tasks efficiently.</p>
          </div>
          <button onClick={handleOpenCreate} className="btn-primary">
            <Plus size={16} />
            Create Task
          </button>
        </div>

        {/* Global Error Notice */}
        {error && <div className="alert-error">{error}</div>}

        {/* Search Bar & Filters Row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
            <Search
              size={17}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '38px',
                paddingRight: searchQuery ? '36px' : '12px',
                borderRadius: 'var(--radius-sm)',
                height: '40px',
                fontSize: '0.9rem',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Filter Badges */}
          <div className="dashboard-filters" style={{ marginBottom: 0 }}>
            {['All', 'Planned', 'In Progress', 'Complete'].map((st) => (
              <button
                key={st}
                className={`filter-btn ${filter === st ? 'active' : ''}`}
                onClick={() => setFilter(st)}
              >
                {st} {st !== 'All' ? `(${tasks.filter((t) => t.status === st).length})` : `(${tasks.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="loading-indicator">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          searchQuery.trim() ? (
            <div className="empty-state">
              <h3>No matching tasks found</h3>
              <p>No tasks found matching "{searchQuery}". Try a different keyword.</p>
              <button onClick={() => setSearchQuery('')} className="btn-secondary">
                Clear Search
              </button>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks yet.</h3>
              <p>Create your first task to start tracking your progress.</p>
              <button onClick={handleOpenCreate} className="btn-primary">
                <Plus size={16} />
                Create Task
              </button>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No {filter} tasks</h3>
              <p>You have no tasks in the "{filter}" status.</p>
              <button onClick={() => setFilter('All')} className="btn-secondary">
                View All Tasks
              </button>
            </div>
          )
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        taskName={taskToDelete?.taskName}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
