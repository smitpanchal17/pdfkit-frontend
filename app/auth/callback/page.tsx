'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * /auth/callback — Supabase PKCE OAuth callback
 *
 * Exchanges the ?code= for a real session HERE before redirecting home.
 * This ensures the session is in localStorage BEFORE the homepage loads,
 * so updateNavForAuth() can read it via getSession() on first paint.
 */
export default function AuthCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const next   = params.get('next') ?? '/';

    if (!code) {
      window.location.replace(next);
      return;
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // ✅ Exchange the PKCE code for a real session HERE, then redirect clean
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error('[auth/callback] PKCE exchange failed:', error.message);
      }
      // Redirect with NO ?code= in the URL — homepage loads cleanly
      window.location.replace(next);
    });
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
        <p style={{ margin: 0, opacity: 0.7, fontSize: 14 }}>Signing you in...</p>
      </div>
    </div>
  );
}
