'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Capped movement for subtle parallax lag
      const { innerWidth, innerHeight } = window;
      const targetX = (e.clientX - innerWidth / 2) * 0.04;
      const targetY = (e.clientY - innerHeight / 2) * 0.04;
      setMousePos({ x: targetX, y: targetY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

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
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.01 : 0.9,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const orbAnimation = prefersReducedMotion
    ? {}
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
      id="top"
      className="relative min-h-screen flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 pt-28 pb-16 overflow-hidden bg-ink"
      aria-labelledby="hero-heading"
    >
      {/* Noise background overlay */}
      <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none z-10" />

      {/* Signature Breathing Glow Orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[580px] lg:w-[820px] h-[340px] sm:h-[580px] lg:h-[820px] rounded-full pointer-events-none z-0 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(212,167,44,0.32) 0%, rgba(201,123,114,0.2) 40%, rgba(91,58,102,0.12) 75%, transparent 100%)',
          x: mousePos.x,
          y: mousePos.y,
        }}
        animate={orbAnimation}
      />

      {/* Hero Content */}
      <motion.div
        className="relative z-20 max-w-4xl text-center mx-auto space-y-8 sm:space-y-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.div variants={itemVariants} className="inline-block">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-plum/80 border border-gold/20 text-gold shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping" />
            <span className="font-mono text-xs sm:text-sm uppercase tracking-widest font-medium">
              GRAPHIC DESIGNER · CAIRO, EGYPT
            </span>
          </div>
        </motion.div>

        {/* Kinetic Headline */}
        <motion.h1
          id="hero-heading"
          variants={itemVariants}
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-parchment leading-[1.08] font-normal"
        >
          <span className="block">A quiet light,</span>
          <span className="block italic text-gold font-light">
            finding form in the dark.
          </span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          variants={itemVariants}
          className="font-sans text-smoke text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Designing purposeful brand identities, visual content, and digital stories shaped by structure and detail.
        </motion.p>
      </motion.div>

      {/* Animated Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <a
          href="#about"
          className="group flex flex-col items-center gap-2 text-smoke hover:text-gold transition-colors duration-300 focus-visible:ring-gold"
          aria-label="Scroll to About Section"
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-5 h-9 rounded-full border border-gold/30 flex items-start justify-center p-1 group-hover:border-gold transition-colors duration-300">
            <motion.div
              animate={
                prefersReducedMotion
                  ? {}
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
