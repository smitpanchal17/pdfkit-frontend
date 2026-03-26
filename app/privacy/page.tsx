import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How PDFKit collects, uses, and protects your personal data.',
};

export default function PrivacyPage() {
  return (
    <main style={{maxWidth:'800px',margin:'0 auto',padding:'60px 24px',lineHeight:1.7,color:'inherit'}}>
      <h1>Privacy Policy</h1>
      <p><em>Last updated: March 2026</em></p>
      <h2>1. Data We Collect</h2>
      <p>PDFKit collects your email when you sign up. Files are processed in-memory and deleted after your session.</p>
      <h2>2. How We Use Your Data</h2>
      <p>Your email manages your account and sends receipts. We never sell your data.</p>
      <h2>3. File Processing</h2>
      <p>All files are deleted immediately after processing. We retain no copies.</p>
      <h2>4. Cookies</h2>
      <p>Essential auth cookies only. No tracking or advertising cookies.</p>
      <h2>5. Third-Party Services</h2>
      <p>Supabase (auth), Razorpay (payments), Vercel (hosting) - each has its own privacy policy.</p>
      <h2>6. Contact</h2>
      <p>Email: <a href="mailto:support@pdfkit.com" style={{color:'#C6FF00'}}>support@pdfkit.com</a></p>
    </main>
  );
}
