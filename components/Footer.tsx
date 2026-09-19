'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, ArrowUp } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Selected Work', hash: 'work' },
  { label: 'About', hash: 'about' },
  { label: 'Expertise', hash: 'expertise' },
  { label: 'Process', hash: 'process' },
  { label: 'Experience', hash: 'experience' },
  { label: 'Tools', hash: 'tools' },
];

const SOCIAL_LINKS = [
  { label: 'Behance', href: 'https://www.behance.net/nourmohamed193', external: true },
  { label: 'Email', href: 'mailto:nm261897@gmail.com', external: false },
  { label: 'Phone', href: 'tel:+201064835850', external: false },
];

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const sectionHref = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);

  return (
    <footer className="relative overflow-hidden border-t border-gold/10 bg-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-hairline" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-gold/[0.07] blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        {/* Sign-off */}
        <div className="flex flex-col gap-6 border-b border-gold/10 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold/70">
              Let&rsquo;s make something with intent
            </p>
            <p className="font-display text-3xl leading-tight text-parchment sm:text-4xl">
              Have a brief, or just an idea?
            </p>
          </div>
          <a
            href={sectionHref('contact')}
            className="sheen inline-flex w-fit items-center gap-2 rounded-full bg-gold-sheen px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink shadow-[0_0_25px_rgba(212,167,44,0.3)] transition-all duration-500 ease-luxe hover:brightness-110 hover:shadow-[0_0_40px_rgba(212,167,44,0.45)]"
          >
            Start a project
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Directory */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-medium tracking-[0.08em] text-parchment">
                NOOR
              </span>
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
            </div>
            <p className="max-w-[26ch] font-sans text-sm leading-relaxed text-smoke">
              Graphic designer shaping brand identities, editorial systems and AI-driven visuals.
            </p>
          </div>

          <nav aria-label="Footer Navigation" className="space-y-4">
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-gold/60">
              Explore
            </span>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {FOOTER_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={sectionHref(item.hash)}
                    className="font-sans text-sm text-smoke transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-4">
            <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-gold/60">
              Elsewhere
            </span>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="group inline-flex items-center gap-1.5 font-sans text-sm text-smoke transition-colors duration-300 hover:text-gold"
                  >
                    {item.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/Nour-Mohamed-CV.pdf"
                  className="font-sans text-sm text-smoke transition-colors duration-300 hover:text-gold"
                  download="Nour-Mohamed-CV.pdf"
                >
                  Download CV
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gold/10 pt-8 sm:flex-row">
          <p className="font-mono text-[11px] tracking-wider text-smoke">
            © {new Date().getFullYear()} Nour Mohamed — designed and built with intent.
          </p>

          <a
            href={isHome ? '#top' : '/'}
            className="group inline-flex items-center gap-2 rounded-full border border-gold/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold/80 transition-all duration-300 hover:border-gold/60 hover:text-gold focus-visible:ring-gold"
          >
            Back to top
            <ArrowUp className="h-3 w-3 transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
