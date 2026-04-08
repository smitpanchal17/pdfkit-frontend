// app/opengraph-image.tsx
// Generates the homepage (and fallback) OG image as a proper PNG.
// Replaces the broken /og-image.svg reference.
// Next.js serves this at /opengraph-image and auto-injects <meta og:image>.

import { ImageResponse } from 'next/og';

export const alt = 'GetPDFKit – Free PDF Tools Online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080810',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '52px' }}>
          <div
            style={{
              width: '76px',
              height: '76px',
              background: '#C6FF00',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '42px',
              fontWeight: 900,
              color: '#080810',
            }}
          >
            P
          </div>
          <span style={{ fontSize: '50px', fontWeight: 900, color: '#E8E8F2' }}>GetPDFKit</span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 900,
            color: '#E8E8F2',
            lineHeight: 1.0,
            marginBottom: '28px',
            letterSpacing: '-2px',
          }}
        >
          Free Online PDF Tools
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: '30px', color: '#9090A8', marginBottom: 'auto' }}>
          Compress · Merge · Split · Convert · OCR · Sign · Protect · Edit
        </div>

        {/* Bottom badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              background: '#C6FF00',
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: '24px', color: '#C6FF00', fontWeight: 700 }}>
            40+ tools · No signup · No install · getpdfkit.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
