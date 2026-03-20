import type { Metadata } from 'next';
import { TOOLS, CAT_ORDER, CAT_LABELS, getToolsByCategory } from '@/lib/tools';
import ClientApp from '@/components/ClientApp';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Free PDF Tools Online – Compress, Merge, Convert & More | PDFKit',
  description:
    'PDFKit gives you 40+ free PDF tools in one browser-based app. Compress, merge, split, convert, sign, protect, and edit any PDF — no installation, no account needed. One of the most affordable PDF toolkits online.',
  alternates: { canonical: '/' },
  openGraph: {
    url:         CONFIG.SITE_URL,
    title:       'Free PDF Tools Online | PDFKit',
    description: '40+ free PDF tools — compress, merge, convert, sign, edit. No signup needed.',
    images:      [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

// Homepage JSON-LD
const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'WebSite',
  name:       'PDFKit',
  url:         CONFIG.SITE_URL,
  description: 'Free online PDF tools — compress, merge, split, convert, sign, edit',
  potentialAction: {
    '@type':        'SearchAction',
    target:         `${CONFIG.SITE_URL}/search?q={search_term_string}`,
    'query-input':  'required name=search_term_string',
  },
};

export default function HomePage() {
  const toolsByCat = CAT_ORDER.map(cat => ({
    cat,
    label: CAT_LABELS[cat],
    tools: getToolsByCategory(cat),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/*
        Static server-rendered tool index for SEO.
        Google sees 40 tool links with their names and descriptions.
        Styled minimally — the full UI loads via ClientApp.
      */}
      <main
        id="tool-seo-content"
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 60px',
                 fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(28px,4vw,52px)',
                     fontWeight: 800, lineHeight: 1.1, marginBottom: '8px' }}>
          Free PDF Tools Online
        </h1>
        <p style={{ color: '#9090a8', fontSize: '16px', marginBottom: '40px', maxWidth: '560px', lineHeight: 1.7 }}>
          40+ browser-based PDF tools — compress, merge, split, convert, sign, and edit any PDF.
          No installation. No account needed. One of the most affordable PDF toolkits online.
        </p>

        {toolsByCat.map(({ cat, label, tools }) => (
          <section key={cat} style={{ marginBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '18px',
                         fontWeight: 800, marginBottom: '16px', color: '#C6FF00' }}>
              {label}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '10px' }}>
              {tools.map(tool => (
                <a
                  key={tool.id}
                  href={`/${tool.id}`}
                  style={{ background: '#0f0f1e', border: '2px solid #22223a', borderRadius: '14px',
                           padding: '16px', textDecoration: 'none', color: '#e8e8f2', display: 'block',
                           transition: 'border-color .2s' }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{tool.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{tool.name}</div>
                  <div style={{ color: '#9090a8', fontSize: '12px', lineHeight: 1.5 }}>{tool.sub}</div>
                </a>
              ))}
            </div>
          </section>
        ))}

        <p style={{ color: '#4a4a6a', fontSize: '13px', marginTop: '40px', lineHeight: 1.8 }}>
          PDFKit brings together 40+ PDF tools in one fast, browser-based app. Trusted by individuals,
          students, and businesses worldwide. All files are processed securely and deleted automatically
          after 60 minutes. No software installation required — works on Windows, Mac, Linux, iOS and Android.
        </p>
      </main>

      {/* ClientApp hydrates the full interactive SPA */}
      <ClientApp initialPage="home" />
    </>
  );
}
