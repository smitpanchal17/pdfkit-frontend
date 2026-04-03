'use client';
import { useEffect } from 'react';
import { CONFIG } from '@/lib/config';

const EXTERNAL_SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  ];

const FALLBACK_API_URL = 'https://pdfkit-backend.vercel.app';

function loadScript(src: string, onLoad?: () => void): void {
    if (document.querySelector(`script[src="${src}"]`)) { onLoad?.(); return; }
    const s = document.createElement('script');
    s.src = src; s.async = true;
    if (onLoad) s.onload = onLoad;
    document.body.appendChild(s);
}

function loadCSS(href: string): void {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
}

function injectConfig(): void {
    const w = window as any;
    if (w._pdfkitConfigInjected) return;
    w._pdfkitConfigInjected = true;
    const script = document.createElement('script');
    const runtimeConfig = {
        apiUrl: CONFIG.API_URL || FALLBACK_API_URL,
        supabaseUrl: CONFIG.SUPABASE_URL,
        supabaseAnon: CONFIG.SUPABASE_ANON,
        razorpayKey: CONFIG.RAZORPAY_KEY,
    };
    script.textContent = `
        window._PDFKIT_API = ${JSON.stringify(runtimeConfig.apiUrl)};
        window._PDFKIT_SUPABASE_URL = ${JSON.stringify(runtimeConfig.supabaseUrl)};
        window._PDFKIT_SUPABASE_ANON = ${JSON.stringify(runtimeConfig.supabaseAnon)};
        window._PDFKIT_RAZORPAY = ${JSON.stringify(runtimeConfig.razorpayKey)};
    `;
    document.head.appendChild(script);
}

interface Props {
    initialPage?: 'home' | 'tool';
    initialToolId?: string;
    toolSlug?: string;    // from app/[tool]/page.tsx
    toolTitle?: string;  // from app/[tool]/page.tsx
}

export default function ClientApp({ initialPage = 'home', initialToolId: _initialToolId, toolSlug, toolTitle }: Props) {
    // toolSlug (from [tool]/page.tsx) and initialToolId are equivalent
    const initialToolId = toolSlug || _initialToolId;
    useEffect(() => {
          injectConfig();
          // Load the app CSS immediately
                  loadCSS('/pdfkit-app.css');

                  let loaded = 0;
          const total = EXTERNAL_SCRIPTS.length;

                  function onAllLoaded() {
                          const w = window as any;
                          if (w.pdfjsLib) {
                                    w.pdfjsLib.GlobalWorkerOptions.workerSrc =
                                                'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                          }
                          loadScript('/pdfkit-app.js?v=9', () => {
                                    // Hide the fallback UI once the SPA is ready
                                    const fallback = document.getElementById('pdfkit-fallback-ui');
                                    if (fallback) fallback.style.display = 'none';
                                    
                                    if (initialToolId) {
                                                const tryOpen = (attempts = 0) => {
                                                              if (typeof w.openTool === 'function') {
                                                                              w.openTool(initialToolId);
                                                              } else if (attempts < 20) {
                                                                              setTimeout(() => tryOpen(attempts + 1), 150);
                                                              }
                                                };
                                                setTimeout(() => tryOpen(), 300);
                                    }
                          });
                  }

                  EXTERNAL_SCRIPTS.forEach(src => {
                          loadScript(src, () => { loaded++; if (loaded === total) onAllLoaded(); });
                  });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
        if (!initialToolId) return;
        const w = window as any;
        const tryOpen = (attempts = 0) => {
                if (typeof w.openTool === 'function') { w.openTool(initialToolId); }
                else if (attempts < 20) { setTimeout(() => tryOpen(attempts + 1), 150); }
        };
        tryOpen();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToolId]);

  return null;
}
