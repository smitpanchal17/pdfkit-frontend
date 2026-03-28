import ClientApp from '@/components/ClientApp';

export const metadata = {
    title: 'Free PDF Tools Online – Compress, Merge, Convert & More | PDFKit',
    description: '40+ browser-based PDF tools — compress, merge, split, convert, sign, and edit any PDF. No installation. No account needed.',
};

export default function HomePage() {
    return (
          <>
                <div id="pdfkit-fallback-ui" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    background: '#0C0C0C',
                    color: '#F2F2F2',
                    fontFamily: 'sans-serif',
                    textAlign: 'center',
                    padding: '20px'
                }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>PK PDFKit</div>
                    <div style={{ fontSize: '16px', color: '#888' }}>Loading your PDF tools...</div>
                    <div style={{ marginTop: '20px', fontSize: '12px', color: '#444' }}>If this takes too long, please refresh the page.</div>
                </div>
                <ClientApp />
          </>
        );
}
