/**
 * auth-patch.js - PDFKit Auth Fixes
 * 1. Removes Apple Sign-In button (not configured)
 * 2. Fixes forgot-password redirectTo so reset emails work
 * 3. Patches signInWithApple calls to show "coming soon" instead of erroring
 * 4. FIX: Handles OAuth hash tokens (#access_token=...) after page load
 *    Race condition: pdfkit-app.js sets _PDFKIT_SUPABASE_URL/_PDFKIT_SUPABASE_ANON
 *    during window.load. This patch waits for those globals then processes tokens.
 */
(function pdfkitAuthPatch() {
    'use strict';

   // 1. Remove Apple Sign-In button whenever it appears
   function removeAppleButton() {
         const buttons = document.querySelectorAll('button.social-btn, button[class*="social"]');
         buttons.forEach(btn => {
                 if (btn.textContent && btn.textContent.trim().includes('Apple')) {
                           btn.remove();
                 }
         });
   }
    removeAppleButton();
    const observer = new MutationObserver(() => removeAppleButton());
    observer.observe(document.body, { childList: true, subtree: true });

   // 2. Patch Supabase resetPasswordForEmail to include redirectTo
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
    patchSupabase();
    window.addEventListener('load', patchSupabase);
    setTimeout(patchSupabase, 1000);
    setTimeout(patchSupabase, 3000);

   // 3. Intercept signInWithApple if called directly
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

   // 4. FIX: OAuth redirect race condition
   // pdfkit-app.js sets window._PDFKIT_SUPABASE_URL and window._PDFKIT_SUPABASE_ANON
   // during its window.load handler. We wait for those globals then process hash tokens.
   async function handleOAuthHashFallback() {
         if (!window.location.hash.includes('access_token')) return;

      let client = null;
         for (let i = 0; i < 30; i++) {
                 if (
                           window._PDFKIT_SUPABASE_URL &&
                           window._PDFKIT_SUPABASE_ANON &&
                           window.supabase &&
                           window.supabase.createClient
                         ) {
                           if (!window._authPatchClient) {
                                       window._authPatchClient = window.supabase.createClient(
                                                     window._PDFKIT_SUPABASE_URL,
                                                     window._PDFKIT_SUPABASE_ANON
                                                   );
                           }
                           client = window._authPatchClient;
                           break;
                 }
                 await new Promise(r => setTimeout(r, 200));
         }

      if (!client) {
              console.warn('[oauth-patch] Supabase client not available after waiting.');
              return;
      }

      if (!window.location.hash.includes('access_token')) return;

      try {
              const hp = new URLSearchParams(window.location.hash.slice(1));
              const at = hp.get('access_token');
              const rt = hp.get('refresh_token') || '';
              const type = hp.get('type');
              if (!at) return;

           if (type !== 'recovery') {
                     await client.auth.setSession({ access_token: at, refresh_token: rt });
                     history.replaceState(null, '', window.location.pathname + window.location.search);
                     window.location.reload();
           } else {
                     await client.auth.setSession({ access_token: at, refresh_token: rt });
                     history.replaceState(null, '', window.location.pathname);
           }
      } catch (e) {
              console.warn('[oauth-patch] setSession error:', e);
      }
   }

   window.addEventListener('load', function() {
         setTimeout(handleOAuthHashFallback, 300);
   });

})();
