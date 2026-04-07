import type { Metadata } from 'next';
import ClientApp from '@/components/ClientApp';
import { TOOLS, CAT_ORDER, CAT_LABELS } from '@/lib/tools';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Free PDF Tools Online – Compress, Merge & Convert | GetPDFKit',
  description: '40+ browser-based PDF tools — compress, merge, split, convert, sign, and edit any PDF. No installation. No account needed. Try free today.',
  alternates: {
    canonical: CONFIG.SITE_URL,
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'GetPDFKit',
  url: CONFIG.SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${CONFIG.SITE_URL}/og-image.png`,
    width: 1200,
    height: 630,
  },
  description: 'GetPDFKit offers 40+ free browser-based PDF tools including compress, merge, split, convert, and edit PDF files online.',
  sameAs: [],
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'GetPDFKit',
  url: CONFIG.SITE_URL,
};

export default function HomePage() {
  const toolsByCategory = CAT_ORDER.map(cat => ({
    cat,
    label: CAT_LABELS[cat],
    tools: TOOLS.filter(t => t.cat === cat),
  })).filter(g => g.tools.length > 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
      />

      <main
        id="homepage-seo-content"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '48px 24px 64px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>
          Free PDF Tools Online
        </h1>
        <p style={{
          fontSize: '17px',
          color: 'var(--text2, #5a5a70)',
          lineHeight: 1.7,
          maxWidth: '580px',
          marginBottom: '12px',
        }}>
          40+ browser-based PDF tools — compress, merge, split, convert, sign, and edit any PDF.
          No installation. No account needed. Files deleted automatically after 60 minutes.
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          fontSize: '13px',
          color: 'var(--text2, #555)',
          marginBottom: '48px',
        }}>
          <span>✅ 100% free for basic use</span>
          <span>🔒 Files deleted in 60 min</span>
          <span>📱 Works on any device</span>
          <span>🚫 No signup required</span>
        </div>

        {toolsByCategory.map(({ cat, label, tools }) => (
          <section key={cat} style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text2, #555)',
              marginBottom: '16px',
            }}>
              {label}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
              gap: '10px',
            }}>
              {tools.map(tool => (
                <a
                  key={tool.id}
                  href={`/${tool.id}`}
                  style={{
                    background: '#12121a',
                    border: '2px solid #22223a',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    textDecoration: 'none',
                    color: '#e8e8f2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{tool.icon}</span>
                  {tool.name}
                </a>
              ))}
            </div>
          </section>
        ))}

        <div style={{
          background: '#0a100a',
          border: '2px solid #C6FF0033',
          borderRadius: '14px',
          padding: '28px',
          textAlign: 'center',
          marginTop: '16px',
        }}>
          <p style={{ fontSize: '15px', color: 'var(--text2, #555)', marginBottom: '12px' }}>
            Need more? Pro plans start at <strong style={{ color: '#C6FF00' }}>₹249/month</strong> — unlimited operations, 1 GB files, no ads.
          </p>
          <a
            href="/pricing"
            style={{
              color: '#C6FF00',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none',
            }}
          >
            View pricing →
          </a>
        </div>
      </main>

      <ClientApp />
    </>
  );
}
