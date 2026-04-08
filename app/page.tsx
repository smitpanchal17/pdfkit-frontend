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
    url: `${CONFIG.SITE_URL}/opengraph-image`,
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
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${CONFIG.SITE_URL}/{search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is GetPDFKit free to use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. GetPDFKit is free for basic use — up to 3 tasks per day with files up to 25 MB. No credit card or account required. Pro plans start at ₹249/month for unlimited operations and 1 GB file support.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my files kept private and secure?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All files are transferred over HTTPS and stored in encrypted cloud buckets. Files are automatically deleted 1 hour after processing. GetPDFKit never reads your document content.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to install software or create an account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No installation or account is needed for free tasks. All tools run directly in your browser on Windows, Mac, Linux, iOS, and Android.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the maximum file size supported?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Free plan supports files up to 25 MB. Pro plan supports up to 200 MB. Pro+ and Business plans support up to 1 GB per file.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many PDF tools does GetPDFKit offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'GetPDFKit offers 40+ PDF tools including compress, merge, split, rotate, convert (PDF to Word, Excel, PowerPoint, JPG), OCR, e-sign, protect, unlock, watermark, and more.',
      },
    },
  ],
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema, faqSchema]) }}
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
