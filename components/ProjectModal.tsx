'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Tag, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  tag: string;
  url: string;
  description: string;
  imageSrc: string;
  galleryImages?: string[];
  featured?: boolean;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const SPRING = { type: 'spring' as const, stiffness: 240, damping: 28 };

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // ── Lock body scroll while modal is open ─────────────────────────────────
  useEffect(() => {
    if (!project) return;
    setActiveImageIndex(0);
    setImageError(false);

    // Preserve scroll position and lock body
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${scrollY}px`;
    document.body.style.width    = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top      = '';
      document.body.style.width    = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY); // restore position
    };
  }, [project]);

  // ── Keyboard: Escape + gallery arrow keys ────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!project) return;
      const imgs = project.galleryImages?.length ? project.galleryImages : [project.imageSrc];
      if (e.key === 'Escape')     { onClose(); }
      if (e.key === 'ArrowLeft')  { setActiveImageIndex((p) => (p - 1 + imgs.length) % imgs.length); }
      if (e.key === 'ArrowRight') { setActiveImageIndex((p) => (p + 1)               % imgs.length); }
    },
    [project, onClose],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!project) return null;

  const imagesList =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [project.imageSrc];

  const currentImage = imagesList[activeImageIndex] ?? project.imageSrc;

  return (
    <AnimatePresence>
      {/* ── Portal overlay ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="absolute inset-0 bg-ink/92 backdrop-blur-2xl"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* ── Modal Panel ─────────────────────────────────────────────────── */}
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          initial={{ opacity: 0, scale: 0.92, y: 28 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={  { opacity: 0, scale: 0.92, y: 28  }}
          transition={SPRING}
          className="
            relative z-10
            w-full max-w-4xl
            rounded-2xl
            border border-gold/30
            bg-[#13101f]/97
            shadow-[0_0_80px_rgba(212,167,44,0.22)]
            flex flex-col
            overflow-hidden
            max-h-[92vh]
          "
          // Stop clicks from bubbling to backdrop
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Close Button ────────────────────────────────────────────── */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-ink/80 border border-gold/30 text-parchment hover:text-gold hover:border-gold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── Image Header ─────────────────────────────────────────────── */}
          <div className="relative w-full h-[280px] sm:h-[400px] lg:h-[460px] bg-ink overflow-hidden shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1    }}
                exit={  { opacity: 0, scale: 0.97  }}
                transition={{ duration: 0.38 }}
                className="absolute inset-0"
              >
                {!imageError ? (
                  <Image
                    src={currentImage}
                    alt={project.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 1000px"
                    className="object-cover object-center"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-plum via-ink to-plum flex flex-col justify-center items-center p-8 text-center">
                    <Sparkles className="w-12 h-12 text-gold/40 mb-4 animate-pulse" />
                    <h3 className="font-display text-2xl text-parchment font-medium italic">
                      {project.title}
                    </h3>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#13101f] via-transparent to-transparent opacity-75 pointer-events-none" />

            {/* Tag pill */}
            <div className="absolute top-5 left-5 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink/90 backdrop-blur-md border border-gold/30 font-mono text-xs uppercase tracking-widest text-gold shadow-lg">
                <Tag className="w-3 h-3" />
                {project.tag}
              </span>
            </div>

            {/* Gallery controls — only shown when there are multiple images */}
            {imagesList.length > 1 && (
              <>
                {/* Prev */}
                <button
                  onClick={() =>
                    setActiveImageIndex((p) => (p - 1 + imagesList.length) % imagesList.length)
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-ink/80 border border-gold/20 text-parchment hover:text-gold hover:border-gold backdrop-blur-md transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {/* Next */}
                <button
                  onClick={() =>
                    setActiveImageIndex((p) => (p + 1) % imagesList.length)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-ink/80 border border-gold/20 text-parchment hover:text-gold hover:border-gold backdrop-blur-md transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnail row */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-ink/80 backdrop-blur-md border border-gold/20">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-9 h-9 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                        idx === activeImageIndex
                          ? 'border-gold scale-110 shadow-md shadow-gold/30'
                          : 'border-transparent opacity-50 hover:opacity-100 hover:border-gold/40'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="36px" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Scrollable Content Body ──────────────────────────────────── */}
          {/* This div is the ONLY element that scrolls; body is locked */}
          <div className="overflow-y-auto overscroll-contain flex-grow p-6 sm:p-10 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-gold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Behance Project Showcase</span>
              </div>
              <h2
                id="modal-project-title"
                className="font-display text-2xl sm:text-4xl text-parchment font-normal"
              >
                {project.title}
              </h2>
            </div>

            <p className="font-sans text-smoke text-base sm:text-lg leading-relaxed">
              {project.description}
            </p>

            <div className="pt-4 border-t border-gold/15 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="font-mono text-[10px] text-smoke/60 uppercase tracking-widest block">
                  Archive Source
                </span>
                <span className="font-mono text-xs text-parchment">
                  Behance Portfolio Case Study
                </span>
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gold text-ink font-mono text-xs font-semibold uppercase tracking-widest hover:bg-parchment transition-all duration-300 shadow-[0_0_25px_rgba(212,167,44,0.35)] hover:shadow-[0_0_40px_rgba(212,167,44,0.55)] shrink-0"
              >
                <span>Open Full Case Study on Behance</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
