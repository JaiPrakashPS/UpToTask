import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutList } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isProfilePage = location.pathname === '/profile';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'baseline', textDecoration: 'none' }}>
          <span className="brand-logo">UpToTask</span>
          <span className="brand-tagline">Your tasks. Your progress.</span>
        </Link>

        {user && (
          <div className="navbar-user">
            {isProfilePage ? (
              <Link
                to="/dashboard"
                className="btn-secondary"
                title="Dashboard Tasks"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <LayoutList size={14} />
                Tasks
              </Link>
            ) : (
              <Link
                to="/profile"
                className="btn-secondary"
                title="View Profile & Statistics"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <User size={14} />
                Profile
              </Link>
            )}

            <span className="user-name" style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name || user.email}
            </span>

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
