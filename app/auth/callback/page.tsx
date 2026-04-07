'use client';

import { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

/**
 * /auth/callback — Supabase OAuth callback handler
 *
 * ROOT CAUSE OF PREVIOUS BUG:
 *   The old version redirected home CLEAN (`window.location.replace('/')`).
 *   auth-patch.js fix #4 only activates when #access_token= is in the URL.
 *   So fix #4 never fired → pdfkit-app.js's onAuthStateChange never triggered
 *   → user landed on home page not logged in.
 *
 * THE FIX:
 *   After PKCE code exchange succeeds, we redirect home WITH tokens in the hash.
 *   auth-patch.js fix #4 then calls window.supabase.auth.setSession() on
 *   pdfkit-app.js's OWN client, triggering onAuthStateChange('SIGNED_IN').
 *
 * Handles both flows:
 *   • PKCE  (?code=...)         → exchange → forward tokens as #access_token=...
 *   • Implicit (#access_token=) → forward hash directly to home
 */
export default function AuthCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code   = params.get('code');
    const next   = params.get('next') ?? '/';
    const hash   = window.location.hash;

    // ── CASE 1: Implicit flow ──────────────────────────────────────────────────
    // Supabase returned #access_token=... in the fragment — forward to home.
    // auth-patch.js fix #4 will call setSession() using pdfkit-app.js's client.
    if (!code && hash.includes('access_token=')) {
      window.location.replace(next + hash);
      return;
    }

    // ── CASE 2: PKCE flow ──────────────────────────────────────────────────────
    if (code) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (error || !data?.session) {
          // Exchange failed (expired code, PKCE verifier mismatch, etc.)
          // Just redirect home without tokens — user will see logged-out state.
          console.error('[auth/callback] PKCE exchange failed:', error?.message ?? 'no session');
          window.location.replace(next);
          return;
        }

        const { access_token, refresh_token } = data.session;

        // ✅ KEY FIX: redirect home WITH tokens in hash fragment.
        // auth-patch.js fix #4 detects #access_token= and calls
        // window.supabase.auth.setSession() on pdfkit-app.js's OWN client,
        // triggering onAuthStateChange('SIGNED_IN') so the UI updates.
        const tokenParams = new URLSearchParams({
          access_token,
          refresh_token: refresh_token || '',
          token_type:    'bearer',
          type:          'signin',
        });
        window.location.replace(next + '#' + tokenParams.toString());
      });
      return;
    }

    // ── CASE 3: No auth data — just go home ────────────────────────────────────
    window.location.replace(next);
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
