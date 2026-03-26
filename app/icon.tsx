import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#080810',
          borderRadius: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{
          fontSize: 200,
          fontWeight: 900,
          color: '#C6FF00',
          lineHeight: 1,
          fontFamily: 'sans-serif',
          letterSpacing: -8,
        }}>
          PDF
        </div>
        <div style={{
          fontSize: 72,
          fontWeight: 700,
          color: '#ffffff',
          fontFamily: 'sans-serif',
          letterSpacing: 4,
          opacity: 0.85,
        }}>
          KIT
        </div>
      </div>
    ),
    { ...size }
  );
}
