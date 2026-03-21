'use client';
import { useEffect } from 'react';

const EXTERNAL_SCRIPTS = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  ];

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
    script.textContent = `
        window._PDFKIT_API = "https://pdfkit-api.vercel.app";
            window._PDFKIT_SUPABASE_URL = "https://snhcniagvrblgkwpafsw.supabase.co";
                window._PDFKIT_SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaGNuaWFndnJibGdrd3BhZnN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTY4MjEsImV4cCI6MjA4OTU3MjgyMX0.sOL1IqFTgssvlBACEYN9CDY6jEAFcxPhiATdtHqM56M";
                    window._PDFKIT_RAZORPAY = "rzp_live_SPQF7pVYaGRfqj";
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
                          loadScript('/pdfkit-app.js?v=2', () => {
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
