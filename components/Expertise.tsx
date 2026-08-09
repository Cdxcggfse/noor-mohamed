'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import GlowBackground from './GlowBackground';

export default function Expertise() {
  const prefersReducedMotion = useReducedMotion();

  const services = [
    {
      id: '01',
      title: 'Visual content & social post design',
      subtitle: 'Social Systems',
      description: 'Engaging, platform-tailored visual campaigns designed to command attention and maintain brand coherence across feeds.',
      gridClass: 'lg:col-span-2 lg:row-span-1',
    },
    {
      id: '02',
      title: 'Branding & creative direction',
      subtitle: 'Identity Systems',
      description: 'Building cohesive visual identities from logo concept to typography, color palettes, and full brand guidelines.',
      gridClass: 'lg:col-span-1 lg:row-span-1',
    },
    {
      id: '03',
      title: 'AI-generated visuals (image & video)',
      subtitle: 'Generative Aesthetics',
      description: 'Leveraging cutting-edge AI tools to generate concept art, commercial storyboards, and surreal campaign imagery.',
      gridClass: 'lg:col-span-1 lg:row-span-1',
    },
    {
      id: '04',
      title: 'Storytelling through visuals',
      subtitle: 'Narrative Design',
      description: 'Weaving conceptual narratives into editorial spreads, promotional decks, and immersive layout compositions.',
      gridClass: 'lg:col-span-2 lg:row-span-1',
    },
    {
      id: '05',
      title: 'Fashion design & pattern making',
      subtitle: 'Structural Craft',
      description: 'Integrating garment construction logic, tactile texture appreciation, and silhouette balance into visual assets.',
      gridClass: 'lg:col-span-3 lg:row-span-1',
    },
  ];

  return (
    <section
      id="expertise"
      className="relative py-24 sm:py-32 lg:py-36 px-6 sm:px-8 lg:px-12 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="expertise-heading"
    >
      {/* Background Radial Glow */}
      <GlowBackground position="bottom-left" opacity={0.16} size="lg" colorTheme="gold-blend" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-16">
        {/* Section Title */}
        <div className="flex items-center gap-4">
          <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
          <h2
            id="expertise-heading"
            className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium"
          >
            02 / WHAT SHE MAKES
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.7,
                delay: prefersReducedMotion ? 0 : index * 0.1,
              }}
              className={`glass-panel glass-panel-hover rounded-2xl p-8 sm:p-10 flex flex-col justify-between group ${service.gridClass}`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
                    {service.subtitle}
                  </span>
                  <span className="font-mono text-xs text-smoke/50">{service.id}</span>
                </div>
                <h3 className="font-display text-2xl sm:text-3xl text-parchment font-medium mb-4 group-hover:text-gold transition-colors duration-300 leading-snug">
                  {service.title}
                </h3>
              </div>
              <p className="font-sans text-smoke text-sm sm:text-base leading-relaxed mt-4">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
