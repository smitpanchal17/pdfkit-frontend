'use client';

import { useState, useCallback } from 'react';
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
          name: 'GetPDFKit',
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

  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'GetPDFKit Pricing',
    url: `${CONFIG.SITE_URL}/pricing`,
    description: 'GetPDFKit pricing plans: Free, Pro (₹249/mo), Pro+ (₹399/mo), Business (₹799/mo).',
    mainEntity: {
      '@type': 'ItemList',
      name: 'GetPDFKit Plans',
      itemListElement: [
        {
          '@type': 'ListItem', position: 1,
          item: { '@type': 'Offer', name: 'Free Plan', price: '0', priceCurrency: 'INR',
                  description: '3 operations/day, 25 MB files, basic tools',
                  seller: { '@type': 'Organization', name: 'GetPDFKit' } },
        },
        {
          '@type': 'ListItem', position: 2,
          item: { '@type': 'Offer', name: 'Pro Plan', price: '249', priceCurrency: 'INR',
                  description: '50 operations/day, 200 MB files, priority processing, no ads',
                  priceSpecification: { '@type': 'UnitPriceSpecification', price: '249',
                    priceCurrency: 'INR', unitCode: 'MON' },
                  seller: { '@type': 'Organization', name: 'GetPDFKit' } },
        },
        {
          '@type': 'ListItem', position: 3,
          item: { '@type': 'Offer', name: 'Pro+ Plan', price: '399', priceCurrency: 'INR',
                  description: 'Unlimited operations, 1 GB files, batch processing, no ads',
                  priceSpecification: { '@type': 'UnitPriceSpecification', price: '399',
                    priceCurrency: 'INR', unitCode: 'MON' },
                  seller: { '@type': 'Organization', name: 'GetPDFKit' } },
        },
        {
          '@type': 'ListItem', position: 4,
          item: { '@type': 'Offer', name: 'Business Plan', price: '799', priceCurrency: 'INR',
                  description: 'Unlimited operations, 1 GB files, API access, 5 team seats',
                  priceSpecification: { '@type': 'UnitPriceSpecification', price: '799',
                    priceCurrency: 'INR', unitCode: 'MON' },
                  seller: { '@type': 'Organization', name: 'GetPDFKit' } },
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
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

      {/* USD Pricing for US/International users */}
      <div style={{ maxWidth:'960px', margin:'48px auto 0', background:'#0d1620', border:'2px solid #3BAFFF', borderRadius:'14px', padding:'24px 28px' }}>
        <h2 style={{ fontSize:'18px', fontWeight:800, color:'#fff', marginBottom:'6px' }}>Pricing in USD (United States &amp; International)</h2>
        <p style={{ fontSize:'13px', color:'#666', marginBottom:'20px' }}>Your local currency is automatically applied at checkout. USD pricing for US users:</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'12px' }}>
          {[
            { plan:'Free',           mo:'$0',     yr:'forever',        note:'No card needed' },
            { plan:'Pro',            mo:'$5.99',  yr:'$59/yr',         note:'Save 18%' },
            { plan:'Pro+ Unlimited', mo:'$8.99',  yr:'$79/yr',         note:'Save 27% · Most popular' },
            { plan:'Business',       mo:'$15.99', yr:'$149/yr',        note:'5 seats' },
          ].map(p => (
            <div key={p.plan} style={{ background:'#111827', border:'1px solid #1e3a5f', borderRadius:'10px', padding:'14px', textAlign:'center' }}>
              <div style={{ fontSize:'11px', color:'#888', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.06em' }}>{p.plan}</div>
              <div style={{ fontWeight:800, fontSize:'22px', color:'#3BAFFF' }}>{p.mo}<span style={{ fontSize:'12px', color:'#555', fontWeight:400 }}>/mo</span></div>
              <div style={{ fontSize:'12px', color:'#aaa', marginTop:'2px' }}>{p.yr}</div>
              <div style={{ fontSize:'11px', color:'#555', marginTop:'2px' }}>{p.note}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:'12px', color:'#444', marginTop:'14px', marginBottom:0 }}>
          Compare: Smallpdf costs $9/mo · ilovepdf ~$6/mo · PDF24 is free (ads). GetPDFKit Pro+ at $8.99/mo gives you the same unlimited features for less.
        </p>
      </div>

      {/* Competitor comparison */}
      <div style={{ maxWidth:'960px', margin:'40px auto 0' }}>
        <h2 style={{ fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'16px' }}>How we compare to alternatives</h2>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #22223a' }}>
                {['Tool','India price','US price','Free limit','Highlights'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', color:'#666', fontWeight:600, whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name:'Smallpdf',  in:'~₹750/mo', us:'$9/mo',    free:'2 tasks/day',      hi:'Biggest brand, most expensive',           hl:false },
                { name:'ilovepdf',  in:'₹500/mo',  us:'~$6/mo',   free:'2 tasks/day',      hi:'Popular, fewer tools',                    hl:false },
                { name:'PDF24',     in:'Free',      us:'Free',     free:'Unlimited',        hi:'100% free, desktop app, ad-supported',    hl:false },
                { name:'GetPDFKit', in:'₹249/mo',  us:'$5.99/mo', free:'3 tasks/day',      hi:'Cheapest Pro · 42 tools · INR billing ✦', hl:true  },
              ].map(c => (
                <tr key={c.name} style={{ borderBottom:'1px solid #1a1a2a', background: c.hl ? 'rgba(198,255,0,0.04)' : 'transparent' }}>
                  <td style={{ padding:'12px 14px', fontWeight: c.hl ? 800 : 600, color: c.hl ? '#C6FF00' : '#ccc' }}>{c.name}</td>
                  <td style={{ padding:'12px 14px', color: c.hl ? '#C6FF00' : '#aaa' }}>{c.in}</td>
                  <td style={{ padding:'12px 14px', color: c.hl ? '#C6FF00' : '#aaa' }}>{c.us}</td>
                  <td style={{ padding:'12px 14px', color:'#777' }}>{c.free}</td>
                  <td style={{ padding:'12px 14px', color:'#666', fontSize:'12px' }}>{c.hi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth:'960px', margin:'48px auto 0' }}>
        <h2 style={{ fontSize:'20px', fontWeight:800, color:'#fff', marginBottom:'16px' }}>Pricing FAQ</h2>
        {[
          { q:'Can I cancel anytime?',             a:'Yes. No contracts, no cancellation fees. Cancel from your account dashboard and keep Pro access until the end of your billing period.' },
          { q:'Is GetPDFKit cheaper than Smallpdf?', a:'Yes. GetPDFKit Pro+ is ₹399/mo ($8.99/mo) vs Smallpdf at $9/mo (~₹750). Same unlimited tasks, OCR, and large files — for less.' },
          { q:'What currencies do you accept?',    a:'INR via Razorpay (UPI, cards, net banking, wallets) for Indian users. USD, EUR, GBP for international users via card.' },
          { q:'Is there a student or NGO discount?', a:'Email support@getpdfkit.com with proof of student or non-profit status for 50% off.' },
          { q:'What happens when the free limit is hit?', a:'You\'ll see an upgrade prompt. You can still use all tools the next day, or upgrade to Pro for 50 tasks/day or Pro+ for unlimited.' },
        ].map((faq, i) => (
          <details key={i} style={{ background:'#111118', border:'1px solid #22223a', borderRadius:'10px', marginBottom:'8px', overflow:'hidden' }}>
            <summary style={{ padding:'14px 20px', cursor:'pointer', fontWeight:600, fontSize:'14px', listStyle:'none', display:'flex', justifyContent:'space-between', alignItems:'center', color:'#ccc' }}>
              {faq.q}<span style={{ color:'#555', marginLeft:'12px', flexShrink:0 }}>+</span>
            </summary>
            <p style={{ padding:'0 20px 14px', fontSize:'13px', color:'#777', lineHeight:1.7, margin:0 }}>{faq.a}</p>
          </details>
        ))}
      </div>
    </main>
    </>
  );
}
