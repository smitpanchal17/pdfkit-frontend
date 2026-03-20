'use client';
// ─────────────────────────────────────────────────────────────────────────────
// ClientApp.tsx — Loads and boots the PDFKit SPA inside Next.js
//
// Flow:
//   1. Load external deps (Supabase, PDF.js) in parallel
//   2. Inject runtime config (API URL, Supabase keys) into window
//   3. Load pdfkit-app.js which calls window.initPDFKit() automatically
//   4. If on a tool page, open that tool after SPA boots
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { CONFIG } from '@/lib/config';

interface Props {
  initialPage?:   'home' | 'tool';
  initialToolId?: string;
}

const EXTERNAL_SCRIPTS = [
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
];

function loadScript(src: string, onLoad?: () => void): void {
  if (document.querySelector(`script[src="${src}"]`)) { onLoad?.(); return; }
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  if (onLoad) s.onload = onLoad;
  document.body.appendChild(s);
}

function injectConfig(): void {
  // Set config on window so pdfkit-app.js can read them
  // These come from NEXT_PUBLIC_ env vars (safe to expose in browser)
  const w = window as any;
  if (!w._pdfkitConfigInjected) {
    w._pdfkitConfigInjected = true;
    // The SPA reads these constants — inject them before initPDFKit runs
    // We use a script tag so they're available as globals (matching the SPA's const declarations)
    const script = document.createElement('script');
    script.textContent = `
      window._PDFKIT_API = ${JSON.stringify(CONFIG.API_URL)};
      window._PDFKIT_SUPABASE_URL = ${JSON.stringify(CONFIG.SUPABASE_URL)};
      window._PDFKIT_SUPABASE_ANON = ${JSON.stringify(CONFIG.SUPABASE_ANON)};
      window._PDFKIT_RAZORPAY = ${JSON.stringify(CONFIG.RAZORPAY_KEY)};
    `;
    document.head.appendChild(script);
  }
}

export default function ClientApp({ initialPage = 'home', initialToolId }: Props) {
  useEffect(() => {
    let loaded = 0;
    const total = EXTERNAL_SCRIPTS.length;

    // Inject env config before anything loads
    injectConfig();

    function onAllLoaded() {
      // Configure PDF.js worker
      const w = window as any;
      if (w.pdfjsLib) {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      // Load the SPA bundle — it will call window.initPDFKit() automatically
      loadScript('/pdfkit-app.js', () => {
        // If on a tool page, open that tool after SPA injects DOM
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
      loadScript(src, () => {
        loaded++;
        if (loaded === total) onAllLoaded();
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle client-side navigation between tool pages
  useEffect(() => {
    if (!initialToolId) return;
    const w = window as any;
    const tryOpen = (attempts = 0) => {
      if (typeof w.openTool === 'function') {
        w.openTool(initialToolId);
      } else if (attempts < 20) {
        setTimeout(() => tryOpen(attempts + 1), 150);
      }
    };
    tryOpen();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialToolId]);

  return null;
}
