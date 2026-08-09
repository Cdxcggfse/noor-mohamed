'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Project } from './ProjectModal';

interface ArcCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

// ─── Spring physics ──────────────────────────────────────────────────────────
const SPRING = { type: 'spring' as const, stiffness: 180, damping: 24, mass: 1 };

// ─── Arc geometry (tune these) ───────────────────────────────────────────────
const ANGLE_STEP = 44;   // degrees between adjacent cards — wider = less crowding
const RADIUS_X   = 460;  // horizontal spread in px
const VISIBLE    = 2;    // show ±VISIBLE cards around active (rest: opacity 0)

function getProps(offset: number) {
  const angle   = offset * ANGLE_STEP;
  const rad     = (angle * Math.PI) / 180;
  const tx      = Math.sin(rad) * RADIUS_X;
  const ry      = angle * 0.65;                         // subtle Y-rotation
  const scale   = Math.max(0.60, 1 - Math.abs(offset) * 0.18);
  const opacity = Math.abs(offset) > VISIBLE ? 0 : Math.max(0, 1 - Math.abs(offset) * 0.42);
  const zIndex  = 100 - Math.abs(offset) * 20;
  const blur    = Math.abs(offset) > 1 ? Math.abs(offset) * 1.5 : 0;
  return { tx, ry, scale, opacity, zIndex, blur };
}

// ─── Wheel debounce — only hijack clear horizontal swipes ───────────────────
function useHorizWheel(cb: (dir: 1 | -1) => void, gap = 360) {
  const last = useRef(0);
  return useCallback(
    (e: WheelEvent) => {
      // Let vertical scrolling pass through completely
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) * 0.8) return;
      if (Date.now() - last.current < gap) return;
      e.preventDefault();
      last.current = Date.now();
      cb(e.deltaX > 0 ? 1 : -1);
    },
    [cb, gap],
  );
}

export default function ArcCarousel({ projects, onSelectProject }: ArcCarouselProps) {
  const [active, setActive] = useState(0);
  const [imgErr, setImgErr] = useState<Record<number, boolean>>({});
  const stageRef            = useRef<HTMLDivElement>(null);
  const touchX              = useRef<number | null>(null);

  // Reset only when the set of project IDs actually changes
  const ids = projects.map((p) => p.id).join(',');
  useEffect(() => { setActive(0); }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = useCallback(
    (dir: 1 | -1) => setActive((p) => (p + dir + projects.length) % projects.length),
    [projects.length],
  );

  // Keyboard — only when carousel is in viewport
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1);  }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  // Horizontal wheel on the stage only
  const onWheel = useHorizWheel(go);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  if (!projects.length) {
    return (
      <div className="py-20 text-center font-mono text-sm text-smoke">
        No projects match this filter.
      </div>
    );
  }

  const activeProject = projects[active];

  return (
    <div className="relative w-full py-6 flex flex-col items-center select-none">

      {/* ── Stage ─────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
        className="relative w-full max-w-7xl h-[480px] sm:h-[560px] flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        {/* Ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-[520px] h-[400px] rounded-full opacity-60"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(212,167,44,0.14) 0%, rgba(91,58,102,0.10) 55%, transparent 80%)',
              filter: 'blur(72px)',
            }}
          />
        </div>

        {/* Decorative arc rail */}
        <div
          aria-hidden
          className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: 920,
            height: 320,
            border: '1px solid rgba(212,167,44,0.09)',
            borderBottom: 'none',
            borderRadius: '460px 460px 0 0',
          }}
        />

        {/* ── Cards ────────────────────────────────────────────────────────── */}
        {projects.map((project, index) => {
          let offset = index - active;
          if (offset >  projects.length / 2) offset -= projects.length;
          if (offset < -projects.length / 2) offset += projects.length;

          const { tx, ry, scale, opacity, zIndex, blur } = getProps(offset);
          const isCurrent = offset === 0;
          const hasErr    = imgErr[project.id];

          // Don't render invisible cards at all (perf)
          if (Math.abs(offset) > VISIBLE + 1) return null;

          return (
            <motion.div
              key={project.id}
              animate={{ x: tx, rotateY: ry, scale, opacity }}
              transition={SPRING}
              style={{
                position:   'absolute',
                top:        '50%',
                left:       '50%',
                // Center the card on the pivot point
                translateY: '-50%',
                marginLeft: -195,
                zIndex,
                filter:     blur > 0 ? `blur(${blur}px)` : 'none',
                willChange: 'transform, opacity, filter',
              }}
              onClick={() => isCurrent ? onSelectProject(project) : setActive(index)}
              className={`
                w-[310px] sm:w-[390px]
                h-[400px] sm:h-[470px]
                rounded-2xl overflow-hidden cursor-pointer
                flex flex-col
                border
                shadow-2xl
                ${isCurrent
                  ? 'border-gold/50 shadow-[0_0_60px_rgba(212,167,44,0.25)] bg-[#1a1625]'
                  : 'border-white/6 bg-[#0d0b14]'}
              `}
            >
              {/* ── Image ──────────────────────────────────────────────── */}
              <div className="relative w-full h-[240px] sm:h-[295px] overflow-hidden shrink-0 bg-[#0d0b14]">
                {!hasErr ? (
                  <Image
                    src={project.imageSrc}
                    alt={project.title}
                    fill
                    sizes="(max-width:768px) 330px, 420px"
                    className={`object-cover object-center transition-all duration-700 ${
                      isCurrent ? 'brightness-100 saturate-100 scale-[1.03]' : 'brightness-50 saturate-40'
                    }`}
                    onError={() => setImgErr((p) => ({ ...p, [project.id]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-plum via-ink to-plum p-6 text-center">
                    <Sparkles className="w-10 h-10 text-gold/35 mb-2" />
                    <span className="font-mono text-[10px] text-gold uppercase tracking-widest">
                      {project.tag}
                    </span>
                  </div>
                )}

                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1625] via-transparent to-transparent opacity-90 pointer-events-none" />

                {/* Tag badge */}
                <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-ink/90 backdrop-blur-md border border-gold/25 font-mono text-[10px] uppercase tracking-widest text-gold">
                  {project.tag}
                </span>

                {/* Quick-view — active card only */}
                {isCurrent && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelectProject(project); }}
                    className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-ink font-mono text-[11px] font-semibold uppercase tracking-wide hover:bg-parchment transition-colors"
                  >
                    <Eye className="w-3 h-3" />
                    Quick View
                  </button>
                )}
              </div>

              {/* ── Body ───────────────────────────────────────────────── */}
              <div className="p-5 flex flex-col justify-between flex-grow border-t border-white/6 bg-[#120f1e]">
                <div className="space-y-1">
                  <h3 className="font-display text-base sm:text-lg text-parchment font-medium leading-snug line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="font-sans text-xs text-smoke line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-white/6 font-mono text-[10px] text-gold uppercase tracking-wide mt-3">
                  <span>{isCurrent ? 'Preview →' : 'Click to focus'}</span>
                  <span className="text-smoke/50">
                    {String(index + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(projects.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* ── Arrow Buttons ─────────────────────────────────────────────── */}
        <button
          onClick={() => go(-1)}
          className="absolute left-2 sm:left-5 z-[200] p-3 rounded-full bg-ink/90 border border-gold/25 text-parchment hover:text-gold hover:border-gold hover:scale-110 transition-all duration-300 backdrop-blur-md shadow-xl"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-2 sm:right-5 z-[200] p-3 rounded-full bg-ink/90 border border-gold/25 text-parchment hover:text-gold hover:border-gold hover:scale-110 transition-all duration-300 backdrop-blur-md shadow-xl"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Dot row + Behance link ─────────────────────────────────────────── */}
      <div className="mt-7 flex flex-col sm:flex-row items-center gap-5 sm:gap-10">
        <div className="flex items-center gap-2">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Project ${idx + 1}`}
              style={{
                height:     10,
                width:      idx === active ? 34 : 10,
                borderRadius: 99,
                background: idx === active ? '#D4A72C' : 'rgba(212,167,44,0.2)',
                boxShadow:  idx === active ? '0 0 12px rgba(212,167,44,0.7)' : 'none',
                transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.a
              key={activeProject.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.22 }}
              href={activeProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-smoke hover:text-gold transition-colors"
            >
              Open on Behance
              <ExternalLink className="w-3 h-3 text-gold" />
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
