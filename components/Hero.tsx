'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const isInView = useInView(heroRef);
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const orbX = useSpring(targetX, { stiffness: 50, damping: 20, mass: 0.8 });
  const orbY = useSpring(targetY, { stiffness: 50, damping: 20, mass: 0.8 });
  const { scrollY } = useScroll();
  const ghostY = useTransform(scrollY, [0, 900], [0, prefersReducedMotion ? 0 : 140]);
  const ghostOpacity = useTransform(scrollY, [0, 700], [1, prefersReducedMotion ? 1 : 0.15]);
  const contentY = useTransform(scrollY, [0, 700], [0, prefersReducedMotion ? 0 : -60]);

  useEffect(() => {
    if (prefersReducedMotion || !isInView || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Capped movement for subtle parallax lag
      const { innerWidth, innerHeight } = window;
      targetX.set((e.clientX - innerWidth / 2) * 0.04);
      targetY.set((e.clientY - innerHeight / 2) * 0.04);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion, isInView, targetX, targetY]);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const headlineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: prefersReducedMotion ? 0.01 : 0.5 },
    },
  };

  const orbAnimation = prefersReducedMotion || !isInView
    ? { scale: 1, opacity: 0.85 }
    : {
        scale: [1, 1.06, 1],
        opacity: [0.75, 1, 0.75],
        transition: {
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      };

  return (
    <section
      ref={heroRef}
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 pt-28 pb-32 overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
    >
      {/* Noise background overlay */}
      <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none z-10" />

      {/* Ghost outlined wordmark — atmospheric depth layer behind content */}
      <motion.div
        aria-hidden="true"
        style={{ y: ghostY, opacity: ghostOpacity }}
        className="absolute inset-0 z-[5] flex items-center justify-center overflow-hidden pointer-events-none"
      >
        <span
          className="font-display text-[22vw] leading-none tracking-tight text-transparent whitespace-nowrap select-none"
          style={{ WebkitTextStroke: '1px rgba(212,167,44,0.12)' }}
        >
          NOOR
        </span>
      </motion.div>

      {/* Signature Breathing Glow Orb */}
      <div
        aria-hidden="true"
        data-depth="1"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] lg:w-[820px] h-[340px] sm:h-[580px] lg:h-[820px] pointer-events-none z-0"
      >
        <motion.div
          className="w-full h-full rounded-full blur-[100px] sm:blur-[130px]"
          style={{
            background:
              'radial-gradient(circle, rgba(212,167,44,0.24) 0%, rgba(201,123,114,0.14) 40%, rgba(91,58,102,0.12) 75%, transparent 100%)',
            x: prefersReducedMotion ? 0 : orbX,
            y: prefersReducedMotion ? 0 : orbY,
          }}
          animate={orbAnimation}
        />
      </div>

      {/* Hero Content */}
      <motion.div
        data-depth="4"
        className="relative z-20 w-full max-w-5xl text-center mx-auto space-y-8 sm:space-y-10"
        style={{ y: contentY }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Headline — masked curtain line reveal */}
        <motion.h1
          id="hero-heading"
          variants={headlineVariants}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-parchment leading-[1.08] font-normal"
        >
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="block"
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
            >
              A quiet light,
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
            <motion.span
              className="block italic text-gold-gradient text-shimmer font-light"
              style={{ animationPlayState: isInView ? 'running' : 'paused' }}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 1.1,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.34,
              }}
            >
              finding form in the dark.
            </motion.span>
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-smoke text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Designing purposeful brand identities, visual content, and digital stories shaped by structure and detail.
        </motion.p>

        {/* Primary Actions */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <a
            href="#work"
            className="sheen inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gold-sheen text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:brightness-110 transition-all duration-500 ease-luxe shadow-[0_0_25px_rgba(212,167,44,0.35)] hover:shadow-[0_0_45px_rgba(212,167,44,0.5)] focus-visible:ring-gold"
          >
            View Selected Work
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
          <a
            href="#contact"
            className="sheen inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-gold/30 text-parchment font-mono text-xs font-medium uppercase tracking-widest hover:border-gold hover:text-gold transition-all duration-500 ease-luxe backdrop-blur-sm bg-plum/20 hover:bg-plum/40 focus-visible:ring-gold"
          >
            Start a Project
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </motion.div>

      {/* Animated Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: prefersReducedMotion ? 0 : 1.2, duration: prefersReducedMotion ? 0 : 0.8 }}
        className="absolute bottom-8 inset-x-0 z-20 flex flex-col items-center gap-2"
      >
        <a
          href="#work"
          className="group flex flex-col items-center gap-2 text-smoke hover:text-gold transition-colors duration-300 focus-visible:ring-gold"
          aria-label="Scroll to Selected Work"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-9 rounded-full border border-gold/30 flex items-start justify-center p-1 group-hover:border-gold transition-colors duration-300">
            <motion.div
              animate={
                prefersReducedMotion || !isInView
                  ? { y: 0 }
                  : {
                      y: [0, 12, 0],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1 h-2 rounded-full bg-gold"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
}
