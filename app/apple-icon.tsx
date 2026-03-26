import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: 180, height: 180,
        background: '#080810',
        borderRadius: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}>
        <div style={{
          fontSize: 78, fontWeight: 900, color: '#C6FF00',
          lineHeight: 1, fontFamily: 'sans-serif', letterSpacing: -2,
        }}>PDF</div>
        <div style={{
          fontSize: 28, fontWeight: 700, color: '#ffffff',
          fontFamily: 'sans-serif', letterSpacing: 2, opacity: 0.85,
        }}>KIT</div>
      </div>
    ),
    { ...size }
  );
}
