'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="relative bg-ink py-10 px-6 sm:px-8 border-t border-gold/15 shadow-[0_-4px_20px_rgba(212,167,44,0.05)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <p className="font-mono text-xs text-smoke tracking-wider">
          © 2026 Noor Mohamed. Designed with care in Cairo.
        </p>

        <a
          href="#top"
          className="font-mono text-xs uppercase tracking-widest text-gold/70 hover:text-gold transition-colors focus-visible:ring-gold"
        >
          Back to Top ↑
        </a>
      </div>
    </footer>
  );
}
