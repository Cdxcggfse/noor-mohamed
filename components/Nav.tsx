'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Work', hash: 'work' },
  { label: 'About', hash: 'about' },
  { label: 'Expertise', hash: 'expertise' },
  { label: 'Process', hash: 'process' },
  { label: 'Experience', hash: 'experience' },
  { label: 'Tools', hash: 'tools' },
  { label: 'Contact', hash: 'contact' },
];

export default function Nav() {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // On sub-pages, section links must first return to the home page.
  const sectionHref = (hash: string) => (isHome ? `#${hash}` : `/#${hash}`);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section observer for active link highlighting (home page only)
  useEffect(() => {
    if (!isHome) return;

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    });

    NAV_ITEMS.forEach((item) => {
      const element = document.getElementById(item.hash);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHome]);

  // Lock body scroll on mobile menu open
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [mobileMenuOpen]);

  // The drawer is a small-screen pattern only
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  // Keep keyboard focus inside the open drawer, restore it on Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      } else if (event.key === 'Tab') {
        const links = Array.from(drawerRef.current?.querySelectorAll<HTMLElement>('a[href], button') ?? []);
        const first = toggleRef.current;
        const last = links[links.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Move focus into the drawer when it opens
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const raf = window.requestAnimationFrame(() => {
      drawerRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    });

    return () => window.cancelAnimationFrame(raf);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
      <div
        className={`relative z-50 mx-auto flex items-center justify-between gap-4 rounded-2xl border px-3.5 sm:px-5 transition-all duration-500 ease-luxe ${
          scrolled
            ? 'max-w-6xl h-14 border-gold/15 bg-ink/80 backdrop-blur-2xl shadow-[0_20px_50px_-30px_rgba(0,0,0,1),0_1px_0_0_rgba(243,236,223,0.04)_inset]'
            : 'max-w-7xl h-16 border-transparent bg-transparent'
        }`}
      >
        {/* Wordmark */}
        <a
          href={isHome ? '#top' : '/'}
          className="group relative z-50 flex items-center gap-2 rounded-lg focus-visible:ring-gold"
          aria-label="Noor Mohamed — home"
        >
          <span className="font-display text-xl sm:text-[1.35rem] font-medium tracking-[0.06em] text-parchment transition-colors duration-500 group-hover:text-gold">
            NOOR
          </span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(212,167,44,0.9)]"
          />
        </a>

        {/* Desktop navigation — one capsule, one travelling indicator */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center">
          <ul className="flex items-center rounded-full border border-gold/10 bg-plum/25 p-1 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const isActive = isHome && activeSection === item.hash;
              return (
                <li key={item.label} className="relative">
                  <a
                    href={sectionHref(item.hash)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative flex items-center rounded-full px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                      isActive ? 'text-ink' : 'text-smoke hover:text-parchment'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full bg-gold-sheen"
                        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={sectionHref('contact')}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gold/25 bg-plum/25 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-parchment backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:text-gold"
          >
            Start a project
            <ArrowUpRight className="h-3 w-3" />
          </a>

          {/* Mobile menu toggle — stays above the drawer */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="relative z-50 lg:hidden rounded-xl border border-gold/20 bg-plum/60 p-2.5 text-parchment transition-colors duration-300 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={drawerRef}
            id="mobile-navigation"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 h-[100dvh] w-full overflow-y-auto overscroll-contain border-b border-gold/15 bg-ink/95 px-6 pb-10 pt-28 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Mobile Navigation" className="mx-auto flex w-full max-w-sm flex-col">
              <span className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-gold/60">
                Navigation
              </span>

              <ul className="flex flex-col divide-y divide-gold/10 border-y border-gold/10">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = isHome && activeSection === item.hash;
                  return (
                    <li key={item.label}>
                      <motion.a
                        href={sectionHref(item.hash)}
                        onClick={() => setMobileMenuOpen(false)}
                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: prefersReducedMotion ? 0 : index * 0.035 + 0.05 }}
                        aria-current={isActive ? 'true' : undefined}
                        className="group flex items-center justify-between py-3.5"
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-[10px] text-gold/50">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`font-display text-2xl transition-colors duration-300 ${
                              isActive ? 'text-gold' : 'text-parchment group-hover:text-gold'
                            }`}
                          >
                            {item.label}
                          </span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-smoke transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
                      </motion.a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 space-y-3">
                <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-gold/60">
                  Status
                </span>
                <p className="font-sans text-sm text-parchment/80">
                  Open to freelance briefs and studio collaborations.
                </p>
                <a
                  href="mailto:nm261897@gmail.com"
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold transition-colors hover:text-parchment"
                >
                  nm261897@gmail.com
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
