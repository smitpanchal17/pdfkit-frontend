'use client';

import { useState, useCallback } from 'react';
import type { Metadata } from 'next';
import { CONFIG } from '@/lib/config';

declare global {
  interface Window { Razorpay: any; }
}

const API_URL = CONFIG.API_URL || 'https://pdfkit-backend.vercel.app';

const PLANS = [
  {
    id: 'pro',
    name: 'Pro',
    monthly: 249,
    annual: 1999,
    desc: 'For individuals who need more PDF power.',
    features: [
      '50 operations / day',
      '200 MB max file size',
      'Priority processing',
      'No ads',
    ],
    popular: false,
  },
  {
    id: 'proPlus',
    name: 'Pro+',
    monthly: 399,
    annual: 3199,
    desc: 'For power users with heavy PDF workloads.',
    features: [
      'Unlimited operations',
      '1 GB max file size',
      'Priority processing',
      'No ads',
      'Batch processing',
    ],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    monthly: 799,
    annual: 6399,
    desc: 'For teams and developers at scale.',
    features: [
      'Unlimited operations',
      '1 GB max file size',
      'Priority processing',
      'No ads',
      'Batch processing',
      'Developer API access',
      '5 team seats',
    ],
    popular: false,
  },
] as const;

type PlanId = (typeof PLANS)[number]['id'];
type Billing = 'monthly' | 'annual';

function getCsrfToken(): string {
  if (typeof document === 'undefined') return '';
  const m = document.cookie.match(/(?:^|;\s*)pdfkit_csrf=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

async function apiFetch(path: string, options: RequestInit = {}) {
  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': getCsrfToken(),
      ...(options.headers as Record<string, string> | undefined),
    },
  });
}

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const [loading, setLoading] = useState<PlanId | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePurchase = useCallback(async (plan: (typeof PLANS)[number]) => {
    setMessage(null);
    setLoading(plan.id);

    try {
      // 1. Create order on backend
      const orderRes = await apiFetch('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ plan: plan.id, billing }),
      });

      if (orderRes.status === 401) {
        setMessage({ type: 'error', text: 'Please log in first to purchase a plan.' });
        setLoading(null);
        return;
      }
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.error || `Server error ${orderRes.status}`);
      }

      const order = await orderRes.json();

      // 2. Open Razorpay checkout
      const rzpKey = CONFIG.RAZORPAY_KEY || order.key_id;
      if (!rzpKey) throw new Error('Razorpay key not configured.');
      if (!window.Razorpay) throw new Error('Razorpay script not loaded. Please refresh the page.');

      await new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: rzpKey,
          order_id: order.order_id,
          amount: order.amount,
          currency: order.currency || 'INR',
          name: 'PDFKit',
          description: `${plan.name} — ${billing}`,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // 3. Verify payment on backend
            try {
              const verifyRes = await apiFetch('/api/payments/verify', {
                method: 'POST',
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  plan: plan.id,
                  billing,
                }),
              });
              if (!verifyRes.ok) {
                const err = await verifyRes.json().catch(() => ({}));
                reject(new Error(err.error || 'Payment verification failed'));
                return;
              }
              resolve();
            } catch (e) {
              reject(e);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('DISMISSED')),
          },
          theme: { color: '#C6FF00' },
        });
        rzp.open();
      });

      setMessage({ type: 'success', text: `${plan.name} plan activated! Enjoy your upgraded access.` });
    } catch (err: any) {
      if (err?.message !== 'DISMISSED') {
        setMessage({ type: 'error', text: err?.message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setLoading(null);
    }
  }, [billing]);

  const annualSavings = (p: (typeof PLANS)[number]) =>
    Math.round(100 - (p.annual / (p.monthly * 12)) * 100);

  return (
    <main style={{ minHeight: '100vh', background: '#0C0C0F', color: '#F2F2F2', fontFamily: "'Plus Jakarta Sans', sans-serif", padding: '60px 24px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <a href="/" style={{ display: 'inline-block', marginBottom: '32px', color: '#C6FF00', textDecoration: 'none', fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>
          ← Back to PDFKit
        </a>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 700, lineHeight: 1.15, marginBottom: '14px' }}>
          Simple, transparent pricing
        </h1>
        <p style={{ color: '#888', fontSize: '16px', maxWidth: '480px', margin: '0 auto 32px' }}>
          Start free. Upgrade when you need more. Cancel anytime.
        </p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: '#1A1A22', borderRadius: '50px', padding: '4px', gap: '4px' }}>
          {(['monthly', 'annual'] as Billing[]).map(b => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: '8px 22px',
                borderRadius: '50px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                background: billing === b ? '#C6FF00' : 'transparent',
                color: billing === b ? '#0C0C0F' : '#888',
                transition: 'all 0.2s',
              }}
            >
              {b === 'monthly' ? 'Monthly' : 'Annual'}
              {b === 'annual' && (
                <span style={{ marginLeft: '6px', fontSize: '11px', background: billing === 'annual' ? '#0C0C0F' : '#C6FF0022', color: billing === 'annual' ? '#C6FF00' : '#C6FF00', padding: '2px 6px', borderRadius: '4px' }}>
                  Save 33%
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Message banner */}
      {message && (
        <div style={{
          maxWidth: '860px', margin: '0 auto 32px',
          padding: '14px 20px', borderRadius: '10px',
          background: message.type === 'success' ? '#0f2a0f' : '#2a0f0f',
          border: `1px solid ${message.type === 'success' ? '#2e7d32' : '#7d2e2e'}`,
          color: message.type === 'success' ? '#69f0ae' : '#ff8a80',
          fontSize: '14px', textAlign: 'center',
        }}>
          {message.text}
          {message.type === 'error' && message.text.includes('log in') && (
            <a href="/" style={{ marginLeft: '12px', color: '#C6FF00', fontWeight: 600 }}>Log in →</a>
          )}
        </div>
      )}

      {/* Plan cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        maxWidth: '960px',
        margin: '0 auto',
      }}>
        {PLANS.map(plan => {
          const price = billing === 'monthly' ? plan.monthly : plan.annual;
          const perMonth = billing === 'annual' ? Math.round(plan.annual / 12) : plan.monthly;
          const isLoading = loading === plan.id;

          return (
            <div key={plan.id} style={{
              position: 'relative',
              background: plan.popular ? '#141420' : '#111118',
              border: plan.popular ? '1.5px solid #C6FF00' : '1.5px solid #222230',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)',
                  background: '#C6FF00', color: '#0C0C0F', fontSize: '11px', fontWeight: 700,
                  padding: '3px 14px', borderRadius: '50px', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</div>
                <div style={{ fontSize: '13px', color: '#777', marginBottom: '16px' }}>{plan.desc}</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 700, lineHeight: 1 }}>₹{perMonth}</span>
                  <span style={{ color: '#666', fontSize: '14px', marginBottom: '4px' }}>/mo</span>
                </div>
                {billing === 'annual' && (
                  <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                    ₹{price} billed annually · <span style={{ color: '#C6FF00' }}>save {annualSavings(plan)}%</span>
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', marginBottom: '24px', flex: 1 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#CCC', marginBottom: '10px' }}>
                    <span style={{ color: '#C6FF00', fontSize: '16px', lineHeight: 1 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan)}
                disabled={!!loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '15px',
                  fontWeight: 700,
                  background: plan.popular ? '#C6FF00' : '#1E1E2A',
                  color: plan.popular ? '#0C0C0F' : '#F2F2F2',
                  opacity: loading && !isLoading ? 0.5 : 1,
                  transition: 'opacity 0.2s, transform 0.1s',
                }}
              >
                {isLoading ? 'Processing…' : `Get ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Free plan row */}
      <div style={{ maxWidth: '960px', margin: '20px auto 0', background: '#111118', border: '1.5px solid #222230', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: '16px' }}>Free</span>
          <span style={{ marginLeft: '12px', color: '#777', fontSize: '14px' }}>3 operations/day · 25 MB files · Basic tools</span>
        </div>
        <a href="/" style={{ color: '#C6FF00', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
          Use for free →
        </a>
      </div>

      {/* Trust signals */}
      <div style={{ textAlign: 'center', marginTop: '56px', color: '#555', fontSize: '13px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '28px' }}>
        {['Secured by Razorpay', 'Cancel anytime', '7-day refund policy', 'Instant activation'].map(t => (
          <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#C6FF00' }}>✓</span> {t}
          </span>
        ))}
      </div>
    </main>
  );
}
