import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

// Automatically redirect temporary Vercel preview deployment hashes to the permanent production domain
// This permanently prevents Google OAuth "origin_mismatch" caused by temporary random Vercel preview URLs.
if (
  typeof window !== 'undefined' &&
  window.location.hostname.includes('vercel.app') &&
  window.location.hostname !== 'up-to-task-4t5w.vercel.app'
) {
  window.location.replace(
    `https://up-to-task-4t5w.vercel.app${window.location.pathname}${window.location.search}`
  );
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'sample-google-client-id.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
