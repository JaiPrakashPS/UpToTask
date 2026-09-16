import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage and verify with server
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('uptotask_token');
      localStorage.removeItem('uptotask_user');
    };

    window.addEventListener('uptotask_unauthorized', handleUnauthorized);

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('uptotask_token');
      const storedUser = localStorage.getItem('uptotask_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);

          // Verify with backend
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('uptotask_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed or expired:', err.message);
          handleUnauthorized();
        }
      }
      setLoading(false);
    };

    initializeAuth();

    return () => {
      window.removeEventListener('uptotask_unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success && res.data.token) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('uptotask_token', receivedToken);
      localStorage.setItem('uptotask_user', JSON.stringify(receivedUser));
    }
    return res.data;
  };

  const signup = async (userData) => {
    const res = await api.post('/auth/signup', userData);
    if (res.data.success && res.data.token) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('uptotask_token', receivedToken);
      localStorage.setItem('uptotask_user', JSON.stringify(receivedUser));
    }
    return res.data;
  };

  const googleLogin = async (credentialOrPayload) => {
    const payload = typeof credentialOrPayload === 'string'
      ? { credential: credentialOrPayload }
      : credentialOrPayload;

    const res = await api.post('/auth/google', payload);
    if (res.data.success && res.data.token) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('uptotask_token', receivedToken);
      localStorage.setItem('uptotask_user', JSON.stringify(receivedUser));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('uptotask_token');
    localStorage.removeItem('uptotask_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        signup,
        googleLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
