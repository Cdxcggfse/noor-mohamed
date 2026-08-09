'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Expertise from '@/components/Expertise';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Tools from '@/components/Tools';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsDesktop(mediaQuery.matches);

    const handlePointerMove = (e: PointerEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    if (mediaQuery.matches && !prefersReducedMotion) {
      window.addEventListener('pointermove', handlePointerMove);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [prefersReducedMotion]);

  return (
    <main className="relative min-h-screen bg-ink text-parchment overflow-x-hidden selection:bg-gold/30 selection:text-parchment">
      {/* Desktop Trailing Ambient Glow Blob */}
      {isDesktop && !prefersReducedMotion && (
        <motion.div
          className="fixed w-72 h-72 rounded-full pointer-events-none z-30 blur-[100px] opacity-20 bg-gradient-to-r from-gold via-rose to-violet"
          animate={{
            x: cursorPos.x - 144,
            y: cursorPos.y - 144,
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
            mass: 0.5,
          }}
        />
      )}

      {/* Sticky Navigation */}
      <Nav />

      {/* Section Components */}
      <Hero />
      <About />
      <Expertise />
      <Work />
      <Experience />
      <Tools />
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
