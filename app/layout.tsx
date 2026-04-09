import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { CONFIG } from '@/lib/config';
import '@/styles/globals.css';

// Self-hosted via Vercel CDN — eliminates external font request and FOUT
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  metadataBase: new URL(CONFIG.SITE_URL),
  title: {
    template: '%s | GetPDFKit',
    default: 'Free PDF Tools Online – Compress, Merge & Convert | GetPDFKit',
  },
  description: '40+ browser-based PDF tools — compress, merge, split, convert, sign, and edit any PDF. No installation. No account needed. Try free today.',
  keywords: ['pdf tools', 'compress pdf', 'merge pdf', 'pdf to word', 'free pdf editor online', 'pdf converter', 'split pdf', 'pdf compressor'],
  authors: [{ name: 'GetPDFKit' }],
  creator: 'GetPDFKit',
  robots: { index: true, follow: true },
  verification: {
    google: 'cJuWk1EJJZbQv1NAjtXuTL0kITVp5e4EDXzhAI8zVO0',
  },
  openGraph: {
    type: 'website',
    siteName: 'GetPDFKit',
    locale: 'en_US',
    url: CONFIG.SITE_URL,
    title: 'Free PDF Tools Online – Compress, Merge & Convert | GetPDFKit',
    description: '40+ free PDF tools — compress, merge, split, convert, sign, and edit any PDF. No installation. No account needed. Try free today.',
    // og:image provided by app/opengraph-image.tsx (auto-generated PNG)
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free PDF Tools Online | GetPDFKit',
    description: '40+ free PDF tools — compress, merge, convert, sign, edit. No signup.',
    // twitter:image provided by app/opengraph-image.tsx (auto-generated PNG)
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#080810'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={plusJakarta.variable} data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{__html: "(function(){var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'dark');if(!t)localStorage.setItem('theme','dark');})();"}} />
        {/* Preconnects — reduce connection setup time for external resources (CWV) */}
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <script src="/auth-patch.js?v=3" defer />
        {/* Google AdSense — Auto Ads (pub-7220621763541803) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7220621763541803"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <div id="pdfkit-loading" aria-hidden="true" />
        <script dangerouslySetInnerHTML={{__html: `
          setTimeout(function() {
            var l = document.getElementById('pdfkit-loading');
            if (l && !document.body.classList.contains('spa-loaded')) {
              console.warn('[PDFKit] SPA load timeout - forcing loading screen hide');
              l.style.display = 'none';
              document.body.classList.add('spa-loaded');
            }
          }, 8000);
        `}} />
        {children}
        {/* Razorpay deferred — loads after page is interactive, not on initial HTML parse */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <Analytics />
        <SpeedInsights />
        {/* Microsoft Clarity — heatmaps & session recordings (project: w90nr7kcyd) */}
        <Script id="clarity-init" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","w90nr7kcyd");
        `}</Script>
      </body>
    </html>
  );
}
