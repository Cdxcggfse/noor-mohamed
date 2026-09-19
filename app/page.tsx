'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring } from 'framer-motion';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Expertise from '@/components/Expertise';
import Process from '@/components/Process';
import Work from '@/components/Work';
import Experience from '@/components/Experience';
import Tools from '@/components/Tools';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import Marquee from '@/components/Marquee';
import VisualInterlude from '@/components/VisualInterlude';
import { getProjectBySlug } from '@/data/projects';

const MARQUEE_ITEMS = [
  'Brand Identity',
  'Social Media',
  'AI Visuals',
  'Editorial',
  'Apparel Graphics',
  'Pattern Making',
  'Art Direction',
  'Motion',
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const interlude = getProjectBySlug('synthetic-dreams');
  const [isDesktop, setIsDesktop] = useState(false);
  const cursorX = useMotionValue(-1000);
  const cursorY = useMotionValue(-1000);
  const blobX = useSpring(cursorX, { stiffness: 200, damping: 30, mass: 0.5 });
  const blobY = useSpring(cursorY, { stiffness: 200, damping: 30, mass: 0.5 });

  useEffect(() => {
    // Check if device has fine pointer (desktop)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsDesktop(mediaQuery.matches);
    if (!mediaQuery.matches || prefersReducedMotion) return;

    let frame = 0;
    let lastEvent: PointerEvent | null = null;

    // One delegated pass paints the spotlight highlight for whichever
    // .spotlight surface the pointer is currently over.
    const applySpotlight = () => {
      frame = 0;
      const e = lastEvent;
      if (!e) return;
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.('.spotlight') as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${e.clientX - rect.left}px`);
      el.style.setProperty('--sy', `${e.clientY - rect.top}px`);
    };

    const handlePointerMove = (e: PointerEvent) => {
      cursorX.set(e.clientX - 144);
      cursorY.set(e.clientY - 144);
      lastEvent = e;
      if (!frame) frame = window.requestAnimationFrame(applySpotlight);
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, cursorX, cursorY]);

  return (
    <main className="relative min-h-screen bg-ink text-parchment overflow-x-hidden selection:bg-gold/30 selection:text-parchment">
      {/* Desktop Trailing Ambient Glow Blob */}
      {isDesktop && !prefersReducedMotion && (
        <motion.div
          className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none z-30 blur-[100px] opacity-25 mix-blend-screen bg-gradient-to-r from-gold via-rose to-violet"
          style={{ x: blobX, y: blobY }}
        />
      )}

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Sticky Navigation */}
      <Nav />

      {/* Section Components — work leads, credentials follow */}
      <Hero />
      <Work />
      {interlude && (
        <VisualInterlude
          imageSrc={interlude.galleryImages[1] ?? interlude.imageSrc}
          title={interlude.title}
          tag={interlude.tag}
          href={`/work/${interlude.slug}`}
        />
      )}
      <About />
      <Expertise />
      <Marquee items={MARQUEE_ITEMS} />
      <Process />
      <Experience />
      <Tools />
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
