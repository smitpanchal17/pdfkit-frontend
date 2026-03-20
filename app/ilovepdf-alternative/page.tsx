import type { Metadata } from 'next';
import ClientApp from '@/components/ClientApp';
import { TOOLS } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Best iLovePDF Alternative — Free, No Signup | PDFKit',
  description:
    'Looking for an iLovePDF alternative? PDFKit offers 40+ free PDF tools with India-first pricing from ₹249/month. No watermarks. No signup needed for free use.',
  alternates: { canonical: '/ilovepdf-alternative' },
};

const FEATURE_COMPARE = [
  { feature: 'Free tools',              pdfkit: '✅ 40+ tools',        ilovepdf: '✅ 25+ tools' },
  { feature: 'File size (free)',         pdfkit: '✅ Up to 25MB',       ilovepdf: '⚠️ Up to 15MB' },
  { feature: 'India pricing (monthly)',  pdfkit: '✅ ₹249/month',       ilovepdf: '❌ USD only ($6.61)' },
  { feature: 'No signup for free use',  pdfkit: '✅ Yes',              ilovepdf: '✅ Yes' },
  { feature: 'PDF Editor (annotate)',   pdfkit: '✅ Built-in canvas',   ilovepdf: '⚠️ Basic' },
  { feature: 'Invoice generator',       pdfkit: '✅ Yes (free)',        ilovepdf: '❌ No' },
  { feature: 'Dark mode',              pdfkit: '✅ Yes',              ilovepdf: '❌ No' },
  { feature: 'Files deleted after use', pdfkit: '✅ 60 minutes',       ilovepdf: '✅ 2 hours' },
  { feature: 'Mobile-optimised UI',     pdfkit: '✅ Fully responsive',  ilovepdf: '✅ Yes' },
  { feature: 'Batch processing',        pdfkit: '✅ Pro+ plan',         ilovepdf: '✅ Premium plan' },
];

export default function IlovepdfAlternativePage() {
  const topTools = TOOLS.slice(0, 12);

  return (
    <>
      <main
        id="tool-seo-content"
        style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px 60px',
                 fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
      >
        <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif",
                     fontSize: 'clamp(26px,4vw,44px)', fontWeight: 800,
                     lineHeight: 1.1, marginBottom: '12px' }}>
          The Best Free iLovePDF Alternative
        </h1>
        <p style={{ color: '#9090a8', fontSize: '15px', marginBottom: '32px', lineHeight: 1.7, maxWidth: '600px' }}>
          PDFKit is a fast, free, browser-based PDF toolkit with 40+ tools, India-first pricing,
          and no watermarks. Everything iLovePDF does — and more.
        </p>

        <a
          href="/"
          style={{ background: '#C6FF00', color: '#000', fontWeight: 700, fontSize: '15px',
                   padding: '14px 28px', borderRadius: '100px', border: '2.5px solid #000',
                   display: 'inline-block', textDecoration: 'none', marginBottom: '48px',
                   boxShadow: '4px 4px 0 #000' }}
        >
          Try PDFKit Free — No Signup →
        </a>

        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>
          PDFKit vs iLovePDF — Feature comparison
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '14px' }}>
          <thead>
            <tr style={{ background: '#0f0f1e' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid #22223a', color: '#9090a8', fontFamily: 'monospace', fontSize: '11px', textTransform: 'uppercase' }}>Feature</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #22223a', color: '#C6FF00', fontWeight: 800 }}>PDFKit</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', borderBottom: '1px solid #22223a', color: '#9090a8' }}>iLovePDF</th>
            </tr>
          </thead>
          <tbody>
            {FEATURE_COMPARE.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #22223a' }}>
                <td style={{ padding: '12px 16px', color: '#ccc' }}>{row.feature}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', background: '#0a100a' }}>{row.pdfkit}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#888' }}>{row.ilovepdf}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '16px' }}>
          Top PDFKit tools — all free
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '8px', marginBottom: '40px' }}>
          {topTools.map(tool => (
            <a key={tool.id} href={`/${tool.id}`}
              style={{ background: '#0f0f1e', border: '2px solid #22223a', borderRadius: '10px',
                       padding: '12px 14px', textDecoration: 'none', color: '#e8e8f2',
                       display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 600 }}>
              <span style={{ fontSize: '18px' }}>{tool.icon}</span>
              {tool.name}
            </a>
          ))}
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
          Why switch from iLovePDF to PDFKit?
        </h2>
        <ul style={{ paddingLeft: '24px', lineHeight: 2.4, fontSize: '14px', color: '#ccc', marginBottom: '32px' }}>
          <li><strong style={{ color: '#C6FF00' }}>India-first pricing:</strong> ₹249/month vs paying in USD on iLovePDF</li>
          <li><strong style={{ color: '#C6FF00' }}>More tools:</strong> Invoice generator, PDF editor, draw tools not on iLovePDF</li>
          <li><strong style={{ color: '#C6FF00' }}>Dark mode:</strong> Easy on the eyes for long document sessions</li>
          <li><strong style={{ color: '#C6FF00' }}>Faster free tier:</strong> 25MB per file vs 15MB on iLovePDF free</li>
          <li><strong style={{ color: '#C6FF00' }}>No watermarks:</strong> Pro plan files are always clean</li>
        </ul>

        <div style={{ background: '#0a100a', border: '2px solid #C6FF0033', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>
            Start free today
          </div>
          <p style={{ color: '#9090a8', fontSize: '14px', marginBottom: '20px' }}>
            40+ tools free. No credit card. No signup required.
          </p>
          <a href="/" style={{ background: '#C6FF00', color: '#000', fontWeight: 700, fontSize: '14px',
                                padding: '12px 28px', borderRadius: '100px', border: '2.5px solid #000',
                                display: 'inline-block', textDecoration: 'none', boxShadow: '3px 3px 0 #000' }}>
            Open PDFKit Free →
          </a>
        </div>
      </main>

      <ClientApp initialPage="home" />
    </>
  );
}
