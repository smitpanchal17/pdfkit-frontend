'use client';

import { useEffect } from 'react';

/**
 * /auth/callback — Supabase OAuth callback page
 *
 * If Supabase is configured to redirect here (instead of back to the page),
 * this page picks up the ?code= param and redirects to home.
 * The main PKCE exchange is handled by pdfkit-app.js on the home page.
 */
export default function AuthCallbackPage() {
  useEffect(() => {
    // The ?code= will be present in the URL.
    // Redirect to home — pdfkit-app.js will handle exchangeCodeForSession on load.
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const next = params.get('next') ?? '/';

    if (code) {
      // Carry the code to the home page so pdfkit-app.js can exchange it
      window.location.replace(`${next}?code=${encodeURIComponent(code)}`);
    } else {
      window.location.replace('/');
    }
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      background: 'var(--bg, #0d0d14)',
      color: 'var(--text, #fff)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255,255,255,0.15)',
          borderTop: '3px solid #6c63ff',
          borderRadius: '50%',
          margin: '0 auto 16px',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>Signing you in…</p>
      </div>
    </div>
  );
}
