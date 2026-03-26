/**
 * auth-patch.js — PDFKit Auth Fixes
 * 1. Removes Apple Sign-In button (not configured)
 * 2. Fixes forgot-password redirectTo so reset emails work
 * 3. Patches signInWithApple calls to show "coming soon" instead of erroring
 */
(function pdfkitAuthPatch() {
  'use strict';

  // ── 1. Remove Apple Sign-In button whenever it appears ─────────────────────
  function removeAppleButton() {
    const buttons = document.querySelectorAll('button.social-btn, button[class*="social"]');
    buttons.forEach(btn => {
      if (btn.textContent && btn.textContent.trim().includes('Apple')) {
        btn.remove();
      }
    });
  }

  // Run immediately and observe for dynamically rendered modals
  removeAppleButton();
  const observer = new MutationObserver(() => removeAppleButton());
  observer.observe(document.body, { childList: true, subtree: true });

  // ── 2. Patch Supabase resetPasswordForEmail to include redirectTo ──────────
  function patchSupabase() {
    const supabase = window.supabase;
    if (!supabase || !supabase.auth) return;

    const origReset = supabase.auth.resetPasswordForEmail.bind(supabase.auth);
    supabase.auth.resetPasswordForEmail = function(email, options) {
      const redirectTo = window.location.origin + '/reset-password';
      const mergedOptions = Object.assign({ redirectTo }, options || {});
      return origReset(email, mergedOptions);
    };
  }

  // Try immediately, then retry after app loads
  patchSupabase();
  window.addEventListener('load', patchSupabase);
  setTimeout(patchSupabase, 1000);
  setTimeout(patchSupabase, 3000);

  // ── 3. Intercept signInWithApple if called directly ────────────────────────
  function patchAppleSignIn() {
    const supabase = window.supabase;
    if (!supabase || !supabase.auth) return;

    const origSignIn = supabase.auth.signInWithOAuth.bind(supabase.auth);
    supabase.auth.signInWithOAuth = function(options) {
      if (options && options.provider === 'apple') {
        console.warn('[PDFKit] Apple Sign-In is not configured. Blocked.');
        return Promise.resolve({ data: null, error: { message: 'Apple Sign-In is not available. Please use Google or email.' } });
      }
      return origSignIn(options);
    };
  }

  patchAppleSignIn();
  window.addEventListener('load', patchAppleSignIn);
  setTimeout(patchAppleSignIn, 1000);
  setTimeout(patchAppleSignIn, 3000);

})();
