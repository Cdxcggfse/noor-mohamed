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

  const courses = [
    {
      title: 'Adobe Photoshop: Beginner to Advanced',
      platform: 'Udemy',
      date: 'Mar 2024',
    },
    {
      title: 'CapCut Desktop and Mobile Mastery',
      platform: 'Udemy',
      date: 'Feb 2025',
    },
    {
      title: 'Fashion Design for Beginners',
      platform: 'Almentor',
      date: 'Aug 2022',
    },
  ];

  const languages = [
    { name: 'Arabic', level: 'Native' },
    { name: 'English', level: 'B2 Professional' },
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
            05 / TOOLS & LEARNING
          </h2>
        </div>

        {/* Side-by-Side Glass Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tools Card */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.7 }}
            className="glass-panel glass-panel-hover rounded-2xl p-8 sm:p-10 space-y-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-display text-2xl text-parchment font-medium">
                  Creative Stack
                </h3>
                <span className="font-mono text-xs text-gold uppercase tracking-wider">
                  SOFTWARE & SUITES
                </span>
              </div>

              <div className="space-y-6">
                {toolCategories.map((cat) => (
                  <div key={cat.label} className="space-y-3">
                    <span className="font-mono text-xs text-smoke uppercase tracking-wider">
                      {cat.label}
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 rounded-lg bg-plum/80 border border-gold/15 text-parchment font-sans text-sm font-medium shadow-sm hover:border-gold/40 hover:text-gold transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gold/10">
              <p className="font-sans text-xs text-smoke/80 italic">
                Continuously expanding capabilities across visual design, motion editing, and Generative AI suites.
              </p>
            </div>
          </motion.div>

          {/* Courses & Languages Card */}
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.7,
              delay: prefersReducedMotion ? 0 : 0.15,
            }}
            className="glass-panel glass-panel-hover rounded-2xl p-8 sm:p-10 space-y-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-6">
                <h3 className="font-display text-2xl text-parchment font-medium">
                  Courses & Spoken Languages
                </h3>
                <span className="font-mono text-xs text-gold uppercase tracking-wider">
                  CREDENTIALS
                </span>
              </div>

              {/* Courses */}
              <div className="space-y-4 mb-8">
                <span className="font-mono text-xs text-smoke uppercase tracking-wider block">
                  Recent Certifications
                </span>
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div
                      key={course.title}
                      className="p-3.5 rounded-xl bg-plum/60 border border-glass-border flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <span className="font-sans text-sm text-parchment font-medium">
                        {course.title}
                      </span>
                      <span className="font-mono text-[11px] text-gold/80 shrink-0">
                        {course.platform} · {course.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-3">
                <span className="font-mono text-xs text-smoke uppercase tracking-wider block">
                  Languages
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((lang) => (
                    <div
                      key={lang.name}
                      className="p-3 rounded-xl bg-plum/60 border border-glass-border flex flex-col"
                    >
                      <span className="font-display text-base text-parchment font-medium">
                        {lang.name}
                      </span>
                      <span className="font-mono text-xs text-smoke">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
