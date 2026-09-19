'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import GlowBackground from './GlowBackground';

export default function Tools() {
  const prefersReducedMotion = useReducedMotion();

  const toolCategories = [
    {
      label: 'Design Software',
      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Canva'],
    },
    {
      label: 'Video & Generative AI Tools',
      skills: ['CapCut (Desktop & Mobile)', 'Midjourney AI Visuals', 'AI Video Generation'],
    },
    {
      label: 'Fashion & Structural Design',
      skills: ['Fashion Sketching', 'Pattern Making & Construction', 'Color Matching & Mood Boards'],
    },
    {
      label: 'Office & Presentation',
      skills: ['Microsoft Word', 'Microsoft PowerPoint'],
    },
  ];

  return (
    <section
      id="tools"
      className="relative py-24 sm:py-32 lg:py-36 px-6 sm:px-8 lg:px-12 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="tools-heading"
    >
      {/* Background Radial Glow */}
      <GlowBackground position="bottom-right" opacity={0.14} size="lg" colorTheme="gold-blend" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
          <h2
            id="tools-heading"
            className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium"
          >
            06 / TOOLS & SOFTWARE
          </h2>
        </div>

        {/* Single consolidated toolkit panel — courses live in Experience,
            languages live in About, so nothing is repeated here. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.7 }}
          className="glass-panel glass-panel-hover spotlight rounded-2xl p-8 sm:p-12 space-y-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gold/15 pb-5">
            <h3 className="font-display text-2xl sm:text-3xl text-parchment font-medium">
              Creative Stack
            </h3>
            <span className="font-mono text-xs text-gold uppercase tracking-wider">
              SOFTWARE & SUITES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {toolCategories.map((cat) => (
              <div key={cat.label} className="space-y-3">
                <span className="font-mono text-xs text-smoke uppercase tracking-wider">
                  {cat.label}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-lg bg-plum/80 border border-gold/15 text-parchment font-sans text-sm font-medium shadow-sm hover:border-gold/40 hover:text-gold hover:bg-plum transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="font-sans text-xs text-smoke/80 italic border-t border-gold/10 pt-6">
            Continuously expanding capabilities across visual design, motion editing, and Generative AI suites.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
