import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About PDFKit',
  description: 'PDFKit offers 40+ free browser-based PDF tools — compress, merge, split, convert, sign, and edit. No installation. No account needed.',
};

export default function AboutPage() {
  return (
    <main style={{maxWidth:'800px',margin:'0 auto',padding:'60px 24px',lineHeight:1.7,color:'inherit'}}>
      <h1>About PDFKit</h1>
      <p>PDFKit is a free, browser-based PDF toolkit with 40+ tools — compress, merge, split, convert, sign, edit, OCR, and more. No installation required. No account needed for basic use.</p>
      <h2>Our Mission</h2>
      <p>We believe PDF tools should be fast, free, and private. Unlike many competitors, PDFKit processes files server-side without permanently storing them — your documents are deleted immediately after processing.</p>
      <h2>What We Offer</h2>
      <ul>
        <li><strong>40+ PDF tools</strong> in one place — organize, convert, secure, edit, and optimize</li>
        <li><strong>Privacy-first</strong> — files are never stored after your session ends</li>
        <li><strong>No installation</strong> — works entirely in your browser</li>
        <li><strong>Pro plans</strong> for power users who need higher limits and batch processing</li>
        <li><strong>Developer API</strong> for integrating PDF tools into your own applications</li>
      </ul>
      <h2>Pricing</h2>
      <p>PDFKit is free for casual use (up to 3 operations/day, 25 MB files). Pro plans start at affordable monthly rates and unlock unlimited operations, larger file sizes, and priority processing.</p>
      <h2>Built With</h2>
      <p>PDFKit is built with Next.js, hosted on Vercel, and powered by a high-performance Node.js backend. Authentication is handled by Supabase. Payments are processed securely via Razorpay.</p>
      <h2>Contact Us</h2>
      <p>Have questions, feedback, or need support? Email us at: <a href="mailto:support@pdfkit.com" style={{color:'#C6FF00'}}>support@pdfkit.com</a></p>
    </main>
  );
}
