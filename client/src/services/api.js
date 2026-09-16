import axios from 'axios';

// Normalize baseURL so it always points to /api even if user omits /api in .env
let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let formattedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
if (!formattedBaseUrl.endsWith('/api')) {
  formattedBaseUrl += '/api';
}

const api = axios.create({
  baseURL: formattedBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from localStorage to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('uptotask_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 responses to automatically clear local storage session if expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('uptotask_token');
      localStorage.removeItem('uptotask_user');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('uptotask_unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
