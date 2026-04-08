// app/[tool]/opengraph-image.tsx
// Generates a per-tool OG image as PNG at build time.
// Replaces the broken /og/{tool}.png references in generateMetadata.

import { ImageResponse } from 'next/og';
import { getTool, getAllToolSlugs } from '@/lib/tools';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Pre-generate at build time for every tool slug
export async function generateImageMetadata({ params }: { params: { tool: string } }) {
  return [
    {
      id: params.tool,
      alt: getTool(params.tool)?.seo.title ?? 'PDF Tool – GetPDFKit',
    },
  ];
}

export default function Image({ params }: { params: { tool: string } }) {
  const tool = getTool(params.tool);
  const name = tool?.name ?? 'PDF Tool';
  const desc = tool?.seo.desc ?? 'Free online PDF tool. No signup. Works on any device.';
  const icon = tool?.icon ?? '📄';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#080810',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
        }}
      >
        {/* Top: GetPDFKit brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '44px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              background: '#C6FF00',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '26px',
              fontWeight: 900,
              color: '#080810',
            }}
          >
            P
          </div>
          <span style={{ fontSize: '26px', fontWeight: 700, color: '#9090A8' }}>GetPDFKit</span>
        </div>

        {/* Tool icon */}
        <div style={{ fontSize: '56px', marginBottom: '20px' }}>{icon}</div>

        {/* Tool name */}
        <div
          style={{
            fontSize: '68px',
            fontWeight: 900,
            color: '#E8E8F2',
            lineHeight: 1.0,
            marginBottom: '24px',
            letterSpacing: '-1.5px',
          }}
        >
          {name}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '26px',
            color: '#9090A8',
            maxWidth: '820px',
            lineHeight: 1.4,
            marginBottom: 'auto',
          }}
        >
          {desc.length > 110 ? desc.slice(0, 107) + '…' : desc}
        </div>

        {/* Bottom trust bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              background: '#C6FF00',
              borderRadius: '50%',
            }}
          />
          <span style={{ fontSize: '20px', color: '#C6FF00', fontWeight: 700 }}>
            Free · No signup · No install · getpdfkit.com
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
