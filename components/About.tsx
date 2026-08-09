'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import GlowBackground from './GlowBackground';

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  const infpTraits = [
    {
      title: 'Idealist',
      desc: 'Designs for meaning, not just surface decoration.',
    },
    {
      title: 'Introspective',
      desc: 'Notices small nuances and details others skip.',
    },
    {
      title: 'Empathic',
      desc: "Shapes visuals around the audience's feeling, not just the brief.",
    },
    {
      title: 'Independent',
      desc: 'Equally at home leading brand direction or freelancing solo.',
    },
  ];

  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 lg:py-36 px-6 sm:px-8 lg:px-12 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="about-heading"
    >
      {/* Positioned Glow Bleed */}
      <GlowBackground position="top-right" opacity={0.14} size="lg" colorTheme="rose-blend" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
          <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium">
            01 / THE PERSON
          </span>
        </div>

        {/* Verbatim Quote with Large Background Serif Quotation Mark */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.8 }}
          className="relative glass-panel rounded-2xl p-8 sm:p-12 lg:p-16 border border-glass-border overflow-hidden"
        >
          {/* Decorative Giant Serif Quote Mark */}
          <span
            className="absolute -bottom-10 -right-4 font-display text-[180px] sm:text-[240px] text-gold/10 select-none pointer-events-none leading-none italic font-serif"
            aria-hidden="true"
          >
            &rdquo;
          </span>

          <blockquote className="relative z-10 max-w-4xl">
            <p className="font-display text-2xl sm:text-4xl lg:text-5xl text-parchment leading-tight font-normal">
              &ldquo;Creative, thoughtful, and detail-oriented. I love meaningful ideas, beautiful visuals, and designs that have purpose.&rdquo;
            </p>
            <cite className="mt-6 block font-mono text-xs sm:text-sm text-gold uppercase tracking-widest not-italic">
              — Nour Mohamed
            </cite>
          </blockquote>
        </motion.div>

        {/* Asymmetric Glass Card Cluster */}
        <div className="space-y-6">
          <h3 className="font-mono text-xs uppercase tracking-widest text-smoke">
            DESIGN PHILOSOPHY & PRACTICE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {infpTraits.map((trait, index) => (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: prefersReducedMotion ? 0.01 : 0.6,
                  delay: prefersReducedMotion ? 0 : index * 0.1,
                }}
                className="glass-panel glass-panel-hover rounded-xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display text-xl text-gold italic font-medium">
                      {trait.title}
                    </span>
                    <span className="font-mono text-[10px] text-smoke/60 uppercase">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="font-sans text-smoke text-sm leading-relaxed">
                    {trait.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Diploma & Film Studio Structural Foundation Highlight */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Fashion Pattern Making */}
          <div className="glass-panel rounded-xl p-6 sm:p-8 border border-gold/15 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-gold font-medium">
                STRUCTURAL FOUNDATION
              </span>
              <h4 className="font-display text-xl text-parchment font-medium">
                Diploma in Fashion Design & Pattern Making
              </h4>
              <p className="font-sans text-smoke text-sm">
                Technical Industrial Institute, Cairo · 2021–2023
              </p>
            </div>
            <p className="font-sans text-sm text-smoke/90 italic border-l-2 border-gold/30 pl-4">
              &ldquo;Specialized in garment pattern construction, fabric selection, and fashion illustration—grounding my graphic design in spatial discipline and tactile precision.&rdquo;
            </p>
          </div>

          {/* Film & AI Video Production */}
          <div className="glass-panel rounded-xl p-6 sm:p-8 border border-gold/15 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-gold font-medium">
                FILM & DIGITAL PRODUCTION
              </span>
              <h4 className="font-display text-xl text-parchment font-medium">
                Pictures Studios Film Experience
              </h4>
              <p className="font-sans text-smoke text-sm">
                Cairo, Egypt · Sept 2025 – Apr 2026
              </p>
            </div>
            <p className="font-sans text-sm text-smoke/90 italic border-l-2 border-gold/30 pl-4">
              &ldquo;Developed AI video visuals, TV commercial graphic assets, and brand profiles aligned with storyboard concepts under tight production deadlines.&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Languages & Core Traits Bar */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.7 }}
          className="glass-panel rounded-xl p-6 border border-gold/10 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-medium">
              Languages:
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-plum/80 border border-gold/20 font-mono text-xs text-parchment">
              Arabic (Native)
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-plum/80 border border-gold/20 font-mono text-xs text-parchment">
              English (B2)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-widest text-smoke">
              Location:
            </span>
            <span className="font-mono text-xs text-gold">
              Gesr El-Suez, Cairo, Egypt
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
