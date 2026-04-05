import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Pricing — Free, Pro, Pro+ and Business Plans | GetPDFKit',
  description: 'GetPDFKit pricing: Free (3 ops/day, 25MB), Pro ₹249/mo, Pro+ ₹399/mo, Business ₹799/mo. Cancel anytime. 7-day refund policy.',
  alternates: {
    canonical: `${CONFIG.SITE_URL}/pricing`,
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
