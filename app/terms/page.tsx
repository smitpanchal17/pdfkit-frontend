import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using PDFKit free online PDF tools.',
};

export default function TermsPage() {
  return (
    <main style={{maxWidth:'800px',margin:'0 auto',padding:'60px 24px',lineHeight:1.7,color:'inherit'}}>
      <h1>Terms of Service</h1>
      <p><em>Last updated: March 2026</em></p>
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing or using PDFKit, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
      <h2>2. Use of Service</h2>
      <p>PDFKit is provided for lawful personal and business use only. You may not use it to process illegal, copyrighted, or harmful content. You are responsible for all content you upload.</p>
      <h2>3. Free Tier Limitations</h2>
      <p>Free accounts are limited to 3 PDF operations per day with files up to 25 MB. Paid plans unlock higher limits as described on the pricing page.</p>
      <h2>4. Payments &amp; Subscriptions</h2>
      <p>Paid plans are billed monthly or annually via Razorpay. Subscriptions automatically renew unless cancelled before the next billing date. You can cancel at any time from your account settings.</p>
      <h2>5. Refund Policy</h2>
      <p>Refunds may be requested within 7 days of payment if the service did not function as described. Contact support with your order ID.</p>
      <h2>6. Service Availability</h2>
      <p>We strive for high availability but do not guarantee uninterrupted service. We are not liable for losses caused by downtime or data loss. Always keep backups of important files.</p>
      <h2>7. Intellectual Property</h2>
      <p>PDFKit and its content are owned by us. You retain ownership of all files you upload and process.</p>
      <h2>8. Termination</h2>
      <p>We reserve the right to suspend or terminate accounts that violate these Terms without notice.</p>
      <h2>9. Changes to Terms</h2>
      <p>We may update these Terms at any time. Continued use of the service after changes constitutes acceptance.</p>
      <h2>10. Contact</h2>
      <p>Questions? Email: <a href="mailto:support@pdfkit.com" style={{color:'#C6FF00'}}>support@pdfkit.com</a></p>
    </main>
  );
}
