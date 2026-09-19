'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import GlowBackground from './GlowBackground';

export default function Process() {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      id: '01',
      title: 'Discover',
      description:
        'Understanding the brief, the audience, and what success looks like before any pixels move.',
    },
    {
      id: '02',
      title: 'Direction',
      description:
        'Mood boards, references, and visual territory — agreeing on the world before building it.',
    },
    {
      id: '03',
      title: 'Design',
      description:
        'The work itself: typography, composition, colour, and iteration until it holds together.',
    },
    {
      id: '04',
      title: 'Deliver',
      description:
        'Final assets, exports, and guidelines, organised so the work is easy to use and stays consistent.',
    },
  ];

  return (
    <section
      id="process"
      className="relative py-24 sm:py-32 lg:py-36 px-6 sm:px-8 lg:px-12 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="process-heading"
    >
      <GlowBackground position="center" opacity={0.12} size="lg" colorTheme="violet-blend" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        <div className="flex items-center gap-4">
          <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
          <h2
            id="process-heading"
            className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium"
          >
            04 / HOW I WORK
          </h2>
        </div>

        <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-parchment font-normal max-w-3xl">
          Four phases, every project.
        </p>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={prefersReducedMotion ? undefined : { y: -4 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.6,
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
              className="glass-panel glass-panel-hover spotlight rounded-2xl p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden group"
            >
              <span
                className="font-display text-5xl text-gold/15 absolute top-3 right-4 select-none pointer-events-none leading-none transition-colors duration-500 group-hover:text-gold/25"
                aria-hidden="true"
              >
                {step.id}
              </span>

              <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
                {step.id}
              </span>

              <h3 className="font-display text-xl sm:text-2xl text-parchment font-medium">
                {step.title}
              </h3>

              <p className="font-sans text-smoke text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
