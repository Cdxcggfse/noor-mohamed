'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Tools', href: '#tools' },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section Observer for Active Link Highlighting
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.href.replace('#', ''));
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1,
    });

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Lock body scroll on mobile menu open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/80 backdrop-blur-md py-4 border-b border-gold/15 shadow-[0_4px_20px_rgba(11,10,15,0.8)]'
          : 'bg-transparent py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Wordmark Logo */}
        <a
          href="#top"
          className="group flex items-center gap-2 focus-visible:ring-gold z-50"
          aria-label="Noor Mohamed Portfolio Home"
        >
          <span className="font-display font-medium text-xl sm:text-2xl tracking-wider text-parchment group-hover:text-gold transition-colors duration-300">
            NOOR
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-7 lg:gap-9">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.replace('#', '');
            return (
              <a
                key={item.label}
                href={item.href}
                className={`font-mono text-xs tracking-widest uppercase transition-colors duration-300 relative py-1 ${
                  isActive
                    ? 'text-gold font-medium after:w-full'
                    : 'text-smoke hover:text-parchment after:w-0 hover:after:w-full'
                } after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:bg-gold after:transition-all after:duration-300`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden z-50 p-2 rounded-lg bg-plum/60 border border-gold/20 text-parchment hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-0 left-0 w-full bg-ink/95 backdrop-blur-2xl z-40 md:hidden flex flex-col justify-center px-8 py-20 border-b border-gold/15"
          >
            <div className="flex flex-col space-y-6 max-w-sm mx-auto w-full">
              <span className="font-mono text-[10px] uppercase tracking-widest text-gold/60 border-b border-gold/10 pb-2">
                Navigation
              </span>
              {NAV_ITEMS.map((item, index) => {
                const isActive = activeSection === item.href.replace('#', '');
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className={`font-display text-2xl tracking-wide flex items-center justify-between ${
                      isActive ? 'text-gold font-medium' : 'text-parchment hover:text-gold'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="w-5 h-5 opacity-60" />
                  </motion.a>
                );
              })}

              <div className="pt-8 border-t border-gold/10 space-y-2">
                <span className="font-mono text-[10px] text-smoke uppercase tracking-widest block">
                  Location
                </span>
                <span className="font-mono text-xs text-parchment">
                  Cairo, Egypt · Open to Projects
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
