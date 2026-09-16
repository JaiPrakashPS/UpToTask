import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <span className="brand-logo">UpToTask</span>
          <span className="brand-tagline">Your tasks. Your progress.</span>
        </div>

        {user && (
          <div className="navbar-user">
            <span className="user-name">{user.name || user.email}</span>
            <button
              onClick={logout}
              className="btn-secondary"
              title="Logout"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
