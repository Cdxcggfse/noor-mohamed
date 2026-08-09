import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nour Mohamed (Noor) — Graphic Designer | Cairo, Egypt',
  description:
    'Portfolio of Nour Mohamed ("Noor"), a graphic designer based in Cairo, Egypt. Creative, detail-oriented design for branding, social media content, AI-generated visuals, and visual storytelling.',
  keywords: [
    'Nour Mohamed',
    'Noor',
    'Graphic Designer Cairo',
    'Branding Egypt',
    'Social Media Design',
    'AI Visuals',
    'Fashion Pattern Making',
  ],
  authors: [{ name: 'Nour Mohamed' }],
  openGraph: {
    title: 'Nour Mohamed (Noor) — Graphic Designer',
    description: 'A quiet light, finding form in the dark.',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Nour Mohamed',
    alternateName: 'Noor',
    jobTitle: 'Graphic Designer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Cairo',
      addressCountry: 'Egypt',
    },
    sameAs: ['https://www.behance.net/nourmohamed193'],
    knowsAbout: [
      'Graphic Design',
      'Branding Identity',
      'Social Media Visuals',
      'AI Visual Generation',
      'Editorial Layout Design',
      'Fashion Pattern Making',
    ],
  };

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${ibmMono.variable} bg-ink text-parchment antialiased selection:bg-gold/30 selection:text-parchment`}
    >
      <body className="min-h-screen bg-ink overflow-x-hidden font-sans relative">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
