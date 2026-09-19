'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Layers, Grid } from 'lucide-react';
import GlowBackground from './GlowBackground';
import ArcCarousel from './ArcCarousel';
import { PROJECTS, PROJECT_CATEGORIES } from '@/data/projects';

export default function Work() {
  const prefersReducedMotion = useReducedMotion();
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d');

  const filteredProjects = useMemo(
    () =>
      selectedCategory === 'All'
        ? PROJECTS
        : PROJECTS.filter(
            (p) => p.tag.toLowerCase() === selectedCategory.toLowerCase(),
          ),
    [selectedCategory],
  );

  const handleImageError = (id: number) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section
      id="work"
      className="relative py-24 sm:py-32 lg:py-36 bg-ink overflow-hidden border-t border-gold/10"
      aria-labelledby="work-heading"
    >
      {/* Background Radial Glow */}
      <GlowBackground position="top-left" opacity={0.15} size="xl" colorTheme="violet-blend" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gold/15 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-8 h-[2px] bg-gold rounded-full" aria-hidden="true" />
              <h2
                id="work-heading"
                className="font-mono text-xs sm:text-sm uppercase tracking-widest text-gold font-medium"
              >
                01 / SELECTED WORK & CASE STUDIES
              </h2>
            </div>
            <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-parchment font-normal">
              Form, light, and visual direction.
            </p>
          </div>

          {/* View Mode Toggle Switch (3D Arc vs Grid) */}
          <div className="flex items-center gap-1.5 self-start md:self-end bg-plum/60 p-1.5 rounded-full border border-gold/20 backdrop-blur-md shadow-[inset_0_1px_0_rgba(243,236,223,0.05)]">
            <button
              type="button"
              onClick={() => setViewMode('3d')}
              aria-pressed={viewMode === '3d'}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-500 ease-luxe ${
                viewMode === '3d'
                  ? 'bg-gold-sheen text-ink font-semibold shadow-[0_0_18px_-2px_rgba(212,167,44,0.55)]'
                  : 'text-smoke hover:text-parchment'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              3D Arc View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-500 ease-luxe ${
                viewMode === 'grid'
                  ? 'bg-gold-sheen text-ink font-semibold shadow-[0_0_18px_-2px_rgba(212,167,44,0.55)]'
                  : 'text-smoke hover:text-parchment'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Grid View
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PROJECT_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              aria-pressed={selectedCategory === cat}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-500 ease-luxe shrink-0 ${
                selectedCategory === cat
                  ? 'bg-plum text-gold border border-gold/50 shadow-[0_0_18px_rgba(212,167,44,0.28),inset_0_1px_0_rgba(243,236,223,0.06)]'
                  : 'bg-ink/60 text-smoke border border-glass-border hover:border-gold/30 hover:text-parchment hover:bg-plum/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Mode Rendering */}
        {viewMode === '3d' ? (
          /* 3D Half-Circular Arc Widget Showcase */
          <ArcCarousel
            key={selectedCategory}
            projects={filteredProjects}
            onSelectProject={(project) => router.push(`/work/${project.slug}`)}
          />
        ) : (
          /* Asymmetric Grid Layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-4">
            {filteredProjects.map((project, index) => {
              const isFeatured = project.featured;
              const hasError = imageErrors[project.id];

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={prefersReducedMotion ? undefined : { y: -6, transition: { duration: 0.3, delay: 0 } }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: prefersReducedMotion ? 0.01 : 0.8,
                    delay: prefersReducedMotion ? 0 : (index % 2) * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`group spotlight relative glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-glass-border shadow-card hover:border-gold/45 transition-[border-color,box-shadow] duration-500 ease-luxe hover:shadow-card-hover ${
                    isFeatured ? 'md:col-span-2 min-h-[460px] lg:min-h-[540px]' : 'min-h-[400px] lg:min-h-[460px]'
                  }`}
                >
                  {/* Light-catch hairline along the top edge */}
                  <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gold-line opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-40" />
                  {/* Stretched link — makes the whole card one accessible target */}
                  <Link
                    href={`/work/${project.slug}`}
                    className="absolute inset-0 z-30"
                  >
                    <span className="sr-only">
                      View case study: {project.title}
                    </span>
                  </Link>

                  {/* Visual Container */}
                  <div className="relative w-full h-[260px] sm:h-[320px] lg:h-[380px] bg-plum/60 overflow-hidden">
                    {!hasError ? (
                      <Image
                        src={project.imageSrc}
                        alt={`${project.title} — ${project.description}`}
                        fill
                        sizes={isFeatured ? '(max-width: 768px) 100vw, 1152px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px'}
                        className="object-cover object-top transition-transform duration-[900ms] ease-luxe group-hover:scale-[1.06]"
                        onError={() => handleImageError(project.id)}
                      />
                    ) : (
                      /* Artistic Dark Frame Fallback */
                      <div className="absolute inset-0 bg-gradient-to-br from-plum via-ink to-plum flex flex-col justify-between p-8 border-b border-gold/10">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-xs text-gold uppercase tracking-widest">
                            {project.tag}
                          </span>
                          <ArrowUpRight className="w-5 h-5 text-smoke group-hover:text-gold transition-colors" />
                        </div>
                        <div className="space-y-2">
                          <span className="font-display text-2xl sm:text-3xl text-parchment font-medium italic group-hover:text-gold transition-colors">
                            {project.title}
                          </span>
                          <p className="font-sans text-xs text-smoke line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Soft Vignette Overlay — keeps the artwork the focus */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none" />

                    {/* Tag Pill */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="inline-block px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-gold/20 font-mono text-[11px] uppercase tracking-widest text-gold shadow-md">
                        {project.tag}
                      </span>
                    </div>

                    {/* Case Study Hint */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-gold/20 font-mono text-[10px] uppercase tracking-widest text-parchment opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        View Case Study
                        <ArrowUpRight className="w-3 h-3 text-gold" />
                      </span>
                    </div>
                  </div>

                  {/* Card Info Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow bg-gradient-to-b from-plum/25 to-plum/50">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-xl sm:text-2xl text-parchment font-medium group-hover:text-gold transition-colors duration-500">
                        {project.title}
                      </h3>
                      <span className="font-mono text-xs text-gold/70 shrink-0 uppercase tracking-wider group-hover:text-gold group-hover:translate-x-1 transition-all duration-500 ease-luxe">
                        Case Study →
                      </span>
                    </div>
                    <p className="font-sans text-smoke text-xs sm:text-sm leading-relaxed mt-2">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
