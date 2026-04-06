/**
 * auth-patch.js - PDFKit Auth Fixes
 * 1. Removes Apple Sign-In button (not configured)
 * 2. Fixes forgot-password redirectTo so reset emails work
 * 3. Patches signInWithApple calls to show "coming soon" instead of erroring
 * 4. FIX: Handles OAuth hash tokens (#access_token=...) after page load.
 *    KEY CHANGE: Now waits for pdfkit-app.js's OWN supabase client
 *    (window.supabase.auth) and calls setSession() ON IT, which triggers
 *    onAuthStateChange('SIGNED_IN') on the correct client instance.
 *    Previously: created a separate _authPatchClient — a different Supabase
 *    instance — so pdfkit-app.js never received the auth state event.
 * 5. FIX: submitAuth() calls updateAuthModal() in its finally block which resets
 *    authErr/authSuccess display to 'none', silently hiding error/success messages.
 * 6. FIX: ensure-profile 401 fallback
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

   // 4. FIX: Handle OAuth tokens in URL hash (#access_token=...)
   //
   // HOW TOKENS ARRIVE HERE:
   //   app/auth/callback/page.tsx now redirects home WITH tokens in the hash after
   //   a successful PKCE exchange (or implicit flow forwarding), e.g.:
   //     https://getpdfkit.com/#access_token=xxx&refresh_token=yyy&type=signin
   //
   // PREVIOUS BUG:
   //   This function created window._authPatchClient (a SEPARATE Supabase instance)
   //   and called setSession() on it. But pdfkit-app.js has its OWN supabase client
   //   (window.supabase, set after overwriting the CDN namespace). A setSession()
   //   call on a DIFFERENT client does NOT trigger onAuthStateChange on pdfkit-app.js's
   //   client — so pdfkit-app.js never saw the SIGNED_IN event and the UI stayed
   //   in the logged-out state.
   //
   // THE FIX:
   //   Wait for pdfkit-app.js to overwrite window.supabase with its CLIENT instance.
   //   Detection: window.supabase.auth exists (client has .auth) but
   //              window.supabase.createClient does NOT (that's on the CDN namespace).
   //   Then call setSession() on THAT client — triggers onAuthStateChange('SIGNED_IN')
   //   on pdfkit-app.js's own listener, which updates the nav/UI correctly.
   async function handleOAuthHashTokens() {
         if (!window.location.hash.includes('access_token=')) return;

         const hp   = new URLSearchParams(window.location.hash.slice(1));
         const at   = hp.get('access_token');
         const rt   = hp.get('refresh_token') || '';
         const type = hp.get('type');
         if (!at) return;

         // Clean URL immediately (before any async work)
         history.replaceState(null, '', window.location.pathname + window.location.search);

         if (type === 'recovery') {
               // Password reset — set session and stay on page for the reset form
               await _setSessionWhenReady(at, rt);
               history.replaceState(null, '', window.location.pathname);
               return;
         }

         await _setSessionWhenReady(at, rt);
   }

   /**
    * Wait for pdfkit-app.js to create its Supabase CLIENT (window.supabase.auth),
    * then call setSession() on IT so onAuthStateChange fires on the right instance.
    *
    * How to detect the client vs. the namespace:
    *   CDN namespace (before pdfkit-app.js runs):  window.supabase.createClient exists
    *   pdfkit-app.js client (after it runs):       window.supabase.auth exists,
    *                                                window.supabase.createClient does NOT
    */
   async function _setSessionWhenReady(access_token, refresh_token) {
         let client = null;

         // Strategy A: wait for pdfkit-app.js's OWN client (preferred path)
         for (let i = 0; i < 80; i++) {   // poll up to 8 seconds
               if (
                     window.supabase &&
                     window.supabase.auth &&
                     typeof window.supabase.auth.setSession === 'function' &&
                     !window.supabase.createClient   // client doesn't expose createClient
               ) {
                     client = window.supabase;
                     break;
               }
               await new Promise(r => setTimeout(r, 100));
         }

         // Strategy B: fallback — create our own client via the CDN namespace
         // (covers edge cases where detection above misses, e.g. if supabase-js
         //  somehow exposes createClient on the client object in a future version)
         if (!client) {
               console.warn('[auth-patch] Strategy A missed — trying fallback client');
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
         }

         if (!client) {
               console.warn('[auth-patch] No supabase client available for setSession.');
               return;
         }

         try {
               const { error } = await client.auth.setSession({ access_token, refresh_token });
               if (error) {
                     console.error('[auth-patch] setSession failed:', error.message);
               } else {
                     console.log('[auth-patch] setSession success — onAuthStateChange(SIGNED_IN) will fire');
                     // No reload needed — pdfkit-app.js's onAuthStateChange listener
                     // fires automatically and updates the nav/UI.
               }
         } catch (e) {
               console.warn('[auth-patch] setSession error:', e);
         }
   }

   window.addEventListener('load', function() {
         // Small delay to let React hydrate and ClientApp start loading external scripts
         setTimeout(handleOAuthHashTokens, 100);
   });

   // 5. FIX: submitAuth() calls updateAuthModal() in its finally block which always
   //    sets authErr.style.display = 'none' and authSuccess.style.display = 'none',
   //    wiping error/success messages before the user can read them.
   function patchSubmitAuth() {
         if (!window.submitAuth || window._submitAuthPatched) return;
         window._submitAuthPatched = true;
         var orig = window.submitAuth;
         window.submitAuth = async function () {
                 var errEl = document.getElementById('authErr');
                 var okEl  = document.getElementById('authSuccess');
                 if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
                 if (okEl)  { okEl.textContent  = ''; okEl.style.display  = 'none'; }
                 await orig();
                 if (errEl && errEl.textContent.trim()) errEl.style.display = 'block';
                 if (okEl  && okEl.textContent.trim())  okEl.style.display  = 'block';
         };
   }

   (function waitForSubmitAuth(attempts) {
         if (window.submitAuth) { patchSubmitAuth(); return; }
         if (attempts < 40) setTimeout(function () { waitForSubmitAuth(attempts + 1); }, 250);
   })(0);

   // 6. FIX: ensure-profile 401 fallback
   (function patchEnsureProfileFallback() {
         var origFetch = window.fetch;
         window.fetch = async function () {
                 var url = typeof arguments[0] === 'string'
                           ? arguments[0]
                           : (arguments[0] && arguments[0].url) || '';

                 var result = await origFetch.apply(this, arguments);

                 if (!url.includes('/api/auth/ensure-profile') || result.ok) {
                           return result;
                 }

                 try {
                           var stored = localStorage.getItem('sb-snhcniagvrblgkwpafsw-auth-token');
                           if (!stored) return result;

                           var session = JSON.parse(stored);
                           var user = session && session.user;
                           if (!user || !user.id) return result;

                           var now = Math.floor(Date.now() / 1000);
                           if (session.expires_at && session.expires_at < now) return result;

                           var fallback = {
                                 ok: true,
                                 user: {
                                       id: user.id,
                                       email: user.email || '',
                                       name: (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name))
                                                   || (user.email && user.email.split('@')[0])
                                                   || 'User',
                                       avatar: (user.user_metadata && user.user_metadata.avatar_url) || null,
                                       plan: 'free'
                                 }
                           };
                           console.log('[auth-patch] ensure-profile fallback used for', fallback.user.email);
                           return new Response(JSON.stringify(fallback), {
                                 status: 200,
                                 headers: { 'Content-Type': 'application/json' }
                           });
                 } catch (e) {
                           return result;
                 }
         };
   })();

})();
