import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Nour Mohamed (Noor) — Graphic Designer & Visual Direction';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '76px 80px',
          backgroundColor: '#0B0A0F',
          backgroundImage:
            'radial-gradient(circle at 30% 28%, rgba(212,167,44,0.30) 0%, rgba(201,123,114,0.16) 38%, rgba(11,10,15,0) 72%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 22,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#D4A72C',
          }}
        >
          <div
            style={{
              width: 64,
              height: 3,
              backgroundColor: '#D4A72C',
              marginRight: 24,
            }}
          />
          Graphic Design · Brand Identity · AI Visuals
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              letterSpacing: -3,
              color: '#F3ECDF',
            }}
          >
            Nour Mohamed
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 38,
              lineHeight: 1.25,
              color: '#D4A72C',
            }}
          >
            A quiet light, finding form in the dark.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 23,
            color: '#9A93A6',
          }}
        >
          <div>Branding · Social · AI Visuals · Editorial</div>
          <div style={{ color: '#D4A72C', letterSpacing: 4 }}>NOOR</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
