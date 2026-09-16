import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, ListTodo, Award, ArrowLeft, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    planned: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tasks/stats');
        if (res.data.success && res.data.stats) {
          setStats(res.data.stats);
        }
      } catch (err) {
        // Fallback: fetch tasks and calculate stats client-side
        try {
          const resTasks = await api.get('/tasks');
          if (resTasks.data.success) {
            const list = resTasks.data.tasks || [];
            const total = list.length;
            const completed = list.filter((t) => t.status === 'Complete').length;
            const inProgress = list.filter((t) => t.status === 'In Progress').length;
            const planned = list.filter((t) => t.status === 'Planned').length;
            const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
            setStats({ total, completed, inProgress, planned, completionRate });
          }
        } catch {
          setError('Unable to load statistics.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <Navbar />

      <main className="container" style={{ paddingBottom: '60px' }}>
        {/* Navigation back */}
        <div style={{ paddingTop: '24px', marginBottom: '16px' }}>
          <Link
            to="/dashboard"
            className="btn-text"
            style={{ paddingLeft: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} />
            Back to Tasks
          </Link>
        </div>

        {/* Profile Card */}
        <div
          style={{
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '28px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#000000',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            {userInitial}
          </div>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.3px', marginBottom: '4px' }}>
              {user?.name || 'User'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '6px' }}>
              {user?.email}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <Calendar size={13} />
              <span>Member since {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Statistics Title */}
        <div style={{ marginBottom: '18px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.3px' }}>
            Task Statistics
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
            Overview of your task completion and productivity.
          </p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        {loading ? (
          <div className="loading-indicator">Loading statistics...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              {/* Total Tasks */}
              <div
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Total Tasks</span>
                  <ListTodo size={16} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {stats.total}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  All created tasks
                </span>
              </div>

              {/* Completed Tasks */}
              <div
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Completed</span>
                  <CheckCircle2 size={16} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {stats.completed}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Finished tasks
                </span>
              </div>

              {/* In Progress */}
              <div
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>In Progress</span>
                  <Clock size={16} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {stats.inProgress}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Currently working on
                </span>
              </div>

              {/* Planned */}
              <div
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Planned</span>
                  <ListTodo size={16} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {stats.planned}
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Not yet started
                </span>
              </div>
            </div>

            {/* Completion Rate Summary Card */}
            <div
              style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '24px',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} />
                  <span style={{ fontWeight: 600, fontSize: '1rem' }}>Overall Completion Rate</span>
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {stats.completionRate}%
                </span>
              </div>

              {/* Sleek Minimal Progress Line */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#EEEEEE',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    width: `${stats.completionRate}%`,
                    height: '100%',
                    backgroundColor: '#000000',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {stats.total === 0
                  ? 'No tasks created yet. Create a task to start seeing statistics.'
                  : `You have completed ${stats.completed} of ${stats.total} total tasks.`}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;
