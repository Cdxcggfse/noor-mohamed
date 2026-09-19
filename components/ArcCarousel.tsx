'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowUpRight, ExternalLink, Sparkles } from 'lucide-react';
import { Project } from '@/data/projects';

interface ArcCarouselProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

// Damped springs keep the arc responsive without overshooting the artwork.
const SPRING = { type: 'spring' as const, stiffness: 120, damping: 26, mass: 0.9 };
const TILT_SPRING = { stiffness: 70, damping: 22, mass: 0.7 };
const SPOT_SPRING = { stiffness: 160, damping: 20, mass: 0.5 };

// ─── Arc geometry ────────────────────────────────────────────────────────────
const ANGLE_STEP = 42;   // degrees between adjacent cards
const RADIUS_MIN = 250;  // narrowest horizontal fan
const RADIUS_MAX = 620;  // widest horizontal fan
const VISIBLE_WIDE = 2;  // cards shown either side on wide stages
const VISIBLE_NARROW = 1;

/**
 * Depth rules that keep the hierarchy unmistakable:
 * — every step back is pushed further than a card's own Y-rotation can reach,
 *   so a neighbour's near edge can never render in front of the focused card;
 * — only the focused card is fully lit; neighbours are hints.
 */
function getProps(offset: number, radiusX: number, visibleRange: number) {
  const step    = Math.abs(offset);
  const angle   = offset * ANGLE_STEP;
  const rad     = (angle * Math.PI) / 180;
  const tx      = Math.sin(rad) * radiusX;
  const ty      = step * 34;                    // cards settle lower as they fan out
  const tz      = -step * 150;                  // 300px of clearance at ±2 (max half-width is 200)
  const ry      = angle * 0.42;                 // gentler turn = less forward protrusion
  const scale   = Math.max(0.6, 1 - step * 0.2);
  const opacity = step === 0 ? 1 : step === 1 ? 0.25 : 0.07;
  const blur    = step === 0 ? 0 : step === 1 ? 3 : 6;
  const dim     = Math.min(0.62, step * 0.42);
  const zIndex  = step === 0 ? 10 : 1;
  return { tx, ty, tz, ry, scale, opacity: step > visibleRange ? 0 : opacity, blur, dim, zIndex };
}

// ─── Wheel debounce — only hijack clear horizontal swipes ───────────────────
function useHorizWheel(cb: (dir: 1 | -1) => void, gap = 360) {
  const last = useRef(0);
  return useCallback(
    (e: WheelEvent) => {
      // Let vertical scrolling pass through completely
      if (e.ctrlKey || Math.abs(e.deltaX) < 8 || Math.abs(e.deltaY) > Math.abs(e.deltaX) * 0.8) return;
      e.preventDefault();
      if (Date.now() - last.current < gap) return;
      last.current = Date.now();
      cb(e.deltaX > 0 ? 1 : -1);
    },
    [cb, gap],
  );
}

const pad = (n: number) => String(n).padStart(2, '0');

// Runs before the first paint in the browser, falls back to useEffect on the server.
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : React.useLayoutEffect;

export default function ArcCarousel({ projects, onSelectProject }: ArcCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [imgErr, setImgErr] = useState<Record<number, boolean>>({});
  const [radiusX, setRadiusX] = useState(RADIUS_MIN);
  const [visibleRange, setVisibleRange] = useState(VISIBLE_WIDE);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const stageRef            = useRef<HTMLDivElement>(null);
  const activeCardRef       = useRef<HTMLDivElement | null>(null);
  const gesture = useRef<{ x: number; y: number; id: number; dragged: boolean; index?: number } | null>(null);
  const suppressClick = useRef(false);
  const focusCardAfterChange = useRef(false);
  const canTilt             = useRef(false);
  const isInView = useInView(stageRef, { margin: '100px' });

  // Scene-level parallax: the whole room leans with the pointer
  const sceneX = useMotionValue(0);
  const sceneY = useMotionValue(0);
  const sceneRotateX = useSpring(sceneY, TILT_SPRING);
  const sceneRotateY = useSpring(sceneX, TILT_SPRING);
  const dragX = useMotionValue(0);
  const dragOffset = useSpring(dragX, { stiffness: 300, damping: 32 });

  // Specular highlight on the focused card — a light that follows the pointer
  const specX = useSpring(50, SPOT_SPRING);
  const specY = useSpring(35, SPOT_SPRING);
  const specular = useMotionTemplate`radial-gradient(340px circle at ${specX}% ${specY}%, rgba(255,255,255,0.16) 0%, rgba(241,212,136,0.08) 38%, transparent 68%)`;

  // Reset only when the set of project IDs actually changes
  const ids = projects.map((p) => p.id).join(',');
  useEffect(() => { setActive(0); }, [ids]); // eslint-disable-line react-hooks/exhaustive-deps

  // The specular highlight belongs to the focused card only
  useEffect(() => {
    setHovered(false);
    if (focusCardAfterChange.current) {
      stageRef.current?.querySelector<HTMLButtonElement>('.shadow-stage-active [data-project-open]')?.focus({ preventScroll: true });
      focusCardAfterChange.current = false;
    }
  }, [active]);

  // Fan width follows the stage: neighbours keep their distance without
  // spilling past the viewport edge on smaller screens.
  useIsoLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const width = el.getBoundingClientRect().width;
      setRadiusX(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * 0.53)));
      setVisibleRange(width < 720 ? VISIBLE_NARROW : VISIBLE_WIDE);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pointer-driven effects stand down on touch devices
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const apply = () => {
      canTilt.current = finePointer.matches;
      if (!finePointer.matches) {
        sceneX.set(0);
        sceneY.set(0);
        setHovered(false);
      }
    };
    apply();
    finePointer.addEventListener('change', apply);
    return () => finePointer.removeEventListener('change', apply);
  }, [sceneX, sceneY]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (projects.length > 1) setActive((p) => (p + dir + projects.length) % projects.length);
    },
    [projects.length],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    focusCardAfterChange.current = (e.target as HTMLElement).hasAttribute('data-project-open');
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    if (e.key === 'Home') { e.preventDefault(); setActive(0); }
    if (e.key === 'End') { e.preventDefault(); setActive(projects.length - 1); }
  };

  // Horizontal wheel on the stage only
  const onWheel = useHorizWheel(go);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // The light follows the pointer without moving any geometry, so it can run
  // safely while a press is in flight.
  const applySpecular = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = activeCardRef.current;
    if (!card) return;
    const cb = card.getBoundingClientRect();
    const overCard = e.clientX >= cb.left - 8 && e.clientX <= cb.right + 8 &&
      e.clientY >= cb.top - 8 && e.clientY <= cb.bottom + 8;
    if (hovered !== overCard) setHovered(overCard);
    if (overCard) {
      specX.set(Math.max(0, Math.min(100, ((e.clientX - cb.left) / cb.width) * 100)));
      specY.set(Math.max(0, Math.min(100, ((e.clientY - cb.top) / cb.height) * 100)));
    }
  };

  const handleSceneMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = gesture.current;
    const pressed = start && start.id === e.pointerId;

    if (pressed && start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      // A press only becomes a drag after a deliberate horizontal pull, so a
      // normal click (even a slightly shaky one) stays a click.
      if (Math.abs(dx) > 16 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        start.dragged = true;
        setDragging(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      if (start.dragged) {
        if (!prefersReducedMotion) dragX.set(Math.max(-60, Math.min(60, dx * 0.25)));
        setHovered(false);
        return;
      }
      // While the button is held, hold the scene still: if the cards drift the
      // press can end on a different element and the click is lost (mouse only,
      // since touch never tilts the scene in the first place).
      applySpecular(e);
      return;
    }

    if (prefersReducedMotion || !canTilt.current) {
      applySpecular(e);
      return;
    }

    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    // Kept gentle: a strong lean swings the off-centre cards far enough to slip
    // out from under an approaching cursor.
    sceneX.set(nx * 2.5);
    sceneY.set(ny * -1.75);
    applySpecular(e);
  };

  const resetScene = () => {
    sceneX.set(0);
    sceneY.set(0);
    setHovered(false);
    specX.set(50);
    specY.set(35);
  };

  const finishGesture = (e: React.PointerEvent<HTMLDivElement>, cancelled = false) => {
    const start = gesture.current;
    gesture.current = null;
    dragX.set(0);
    setDragging(false);
    if (!start) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dragged = start.dragged;

    if (!cancelled && dragged && Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? 1 : -1);
    }

    // Activate the card that was pressed, not wherever the pointer drifted to.
    // The scene settles on a spring, so a naive click can land on a neighbour.
    if (!cancelled && !dragged) {
      let index = start.index;
      if (typeof index !== 'number') {
        // The press may have landed a frame before a card arrived under the
        // cursor; fall back to whatever is genuinely under the release point.
        const releaseTarget = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
        const surface = releaseTarget?.closest?.('[data-project-open]') as HTMLElement | null;
        const parsed = surface ? Number(surface.dataset.index) : NaN;
        if (Number.isInteger(parsed)) index = parsed;
      }
      if (typeof index === 'number') {
        suppressClick.current = true;
        if (index === active) onSelectProject(projects[active]);
        else setActive(index);
      } else {
        suppressClick.current = false;
      }
    } else {
      suppressClick.current = dragged;
    }

    resetScene();
  };

  if (!projects.length) {
    return (
      <div className="py-20 text-center font-mono text-sm text-smoke">
        No projects match this filter.
      </div>
    );
  }

  const activeProject = projects[active];

  return (
    <div
      className="relative w-full py-6 flex flex-col items-center select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      onKeyDown={handleKeyDown}
    >
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {active + 1} of {projects.length}: {activeProject?.title}
      </p>

      {/* ── Stage ─────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        data-depth="3"
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          // Controls marked data-no-drag keep click behaviour intact.
          const target = e.target as HTMLElement | null;
          if (target?.closest?.('[data-no-drag]')) return;
          const surface = target?.closest?.('[data-project-open]') as HTMLElement | null;
          const index = surface ? Number(surface.dataset.index) : undefined;
          suppressClick.current = false;
          gesture.current = {
            x: e.clientX,
            y: e.clientY,
            id: e.pointerId,
            dragged: false,
            index: Number.isInteger(index) ? index : undefined,
          };
        }}
        onPointerMove={handleSceneMove}
        onPointerLeave={resetScene}
        onPointerUp={(e) => finishGesture(e)}
        onPointerCancel={(e) => finishGesture(e, true)}
        onClickCapture={(e) => {
          if (suppressClick.current) {
            e.preventDefault();
            e.stopPropagation();
            suppressClick.current = false;
          }
        }}
        className={`relative w-full max-w-7xl h-[600px] sm:h-[700px] flex items-center justify-center ${
          dragging ? 'cursor-grabbing' : ''
        }`}
        style={{ perspective: '1800px', touchAction: 'pan-y pinch-zoom' }}
      >
        {/* ── Tilted scene: glow, rail, floor shadows, cards ───────────────── */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            rotateX: prefersReducedMotion ? 0 : sceneRotateX,
            rotateY: prefersReducedMotion ? 0 : sceneRotateY,
            x: prefersReducedMotion ? 0 : dragOffset,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Ambient stage glow */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div
              className="w-[560px] h-[420px] rounded-full opacity-70 animate-glow-breathe"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(212,167,44,0.16) 0%, rgba(91,58,102,0.12) 52%, transparent 80%)',
                filter: 'blur(78px)',
                animationPlayState: isInView && !prefersReducedMotion ? 'running' : 'paused',
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
              maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 92%)',
              WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 92%)',
            }}
          />

          {/* Floor contact shadows — ground the arc so it reads as physical */}
          {projects.map((project, index) => {
            let offset = index - active;
            if (offset >  projects.length / 2) offset -= projects.length;
            if (offset < -projects.length / 2) offset += projects.length;
            if (Math.abs(offset) > visibleRange) return null;

            const { tx, ty, scale, opacity } = getProps(offset, radiusX, visibleRange);
            const isCurrent = offset === 0;

            return (
              <motion.div
                key={`floor-${project.id}`}
                aria-hidden
                initial={false}
                animate={{ x: tx, y: ty, scale, opacity: opacity * (isCurrent ? 1 : 0.6) }}
                transition={prefersReducedMotion ? { duration: 0 } : SPRING}
                className="absolute top-1/2 left-1/2 w-[318px] sm:w-[400px] h-[56px] mt-[202px] sm:mt-[246px] -ml-[159px] sm:-ml-[200px] rounded-[50%] pointer-events-none"
                style={{
                  background: isCurrent
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(212,167,44,0.18) 40%, rgba(0,0,0,0.35) 62%, transparent 78%)'
                    : 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 48%, transparent 74%)',
                  filter: 'blur(7px)',
                }}
              />
            );
          })}

          {/* ── Cards ────────────────────────────────────────────────────────── */}
          {projects.map((project, index) => {
            let offset = index - active;
            if (offset >  projects.length / 2) offset -= projects.length;
            if (offset < -projects.length / 2) offset += projects.length;

            const { tx, ty, tz, ry, scale, opacity, zIndex, blur, dim } = getProps(offset, radiusX, visibleRange);
            const isCurrent = offset === 0;
            const hasErr    = imgErr[project.id];

            // Re-enter at the far edge rather than crossing through the centre.
            if (Math.abs(offset) > visibleRange) return null;

            return (
              <motion.div
                key={project.id}
                ref={isCurrent ? activeCardRef : undefined}
                initial={{ x: tx, y: ty, rotateY: ry, scale, opacity: 0, z: tz }}
                animate={{ x: tx, y: ty, rotateY: ry, scale, opacity, z: tz }}
                transition={prefersReducedMotion ? { duration: 0 } : SPRING}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${projects.length}`}
                aria-hidden={!isCurrent}
                style={{
                  position:   'absolute',
                  top:        '50%',
                  left:       '50%',
                  // Centering is handled by responsive negative margins below
                  translateY: '-50%',
                  zIndex,
                  filter:     blur > 0 ? `blur(${blur}px)` : 'none',
                  transformStyle: 'preserve-3d',
                }}
                className={`
                  pointer-events-auto
                  w-[318px] sm:w-[400px]
                  h-[452px] sm:h-[540px]
                  -ml-[159px] sm:-ml-[200px]
                  rounded-2xl
                  flex flex-col card-sheen
                  ${
                    isCurrent
                      ? 'shadow-stage-active'
                      : 'shadow-stage-side'
                  }
                `}
              >
                <button
                  type="button"
                  data-project-open
                  data-index={index}
                  tabIndex={isCurrent ? 0 : -1}
                  aria-label={isCurrent ? `Open case study: ${project.title}` : `Focus project: ${project.title}`}
                  onClick={() => isCurrent ? onSelectProject(project) : setActive(index)}
                  className={`absolute inset-0 z-40 rounded-2xl ${isCurrent ? 'cursor-pointer' : 'cursor-grab'}`}
                />
                {/* Chrome frame — lit rim on the focused card, silence behind it */}
                <div
                  className={`absolute inset-0 rounded-2xl pointer-events-none transition-colors duration-500 ${
                    isCurrent ? 'bg-gradient-to-b from-gold/50 via-gold/12 to-plum/60' : 'bg-gradient-to-b from-white/[0.06] to-black/40'
                  }`}
                />
                <div className="absolute inset-[1px] rounded-[15px] overflow-hidden bg-[#0f0c18]">
                  {/* Specular highlight — only on the focused card, follows the pointer */}
                  {isCurrent && (
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 z-30 pointer-events-none mix-blend-soft-light transition-opacity duration-500"
                      style={{ background: specular, opacity: hovered ? 1 : 0 }}
                    />
                  )}

                  {/* ── Board — the artwork owns the whole card ─────────────── */}
                  <div className="relative w-full h-full">
                    {!hasErr ? (
                      <Image
                        src={project.imageSrc}
                        alt={project.title}
                        fill
                        sizes="(max-width: 639px) 318px, 400px"
                        draggable={false}
                        className={`object-cover object-top transition-all duration-700 ease-luxe ${
                          isCurrent ? 'brightness-100 saturate-100 scale-[1.03]' : 'brightness-75 saturate-[0.72] scale-100'
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

                    {/* Depth dimmer — neighbouring cards sit further back in the room */}
                    <div
                      className="absolute inset-0 bg-ink pointer-events-none transition-opacity duration-700"
                      style={{ opacity: dim }}
                    />

                    {/* Caption scrim — the board stays legible under the type */}
                    <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-[#0a0812] via-[#0a0812]/72 to-transparent pointer-events-none" />

                    {/* Tag badge */}
                    <span className="absolute top-3.5 left-3.5 z-10 rounded-full border border-gold/25 bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gold backdrop-blur-md">
                      {project.tag}
                    </span>

                    {/* Golden action — a real control, never a drag surface */}
                    {isCurrent && (
                      <button
                        type="button"
                        data-no-drag
                        tabIndex={-1}
                        aria-label={`Open case study: ${project.title}`}
                        onClick={(e) => { e.stopPropagation(); onSelectProject(project); }}
                        className="absolute top-3.5 right-3.5 z-50 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gold-sheen px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink shadow-[0_0_22px_rgba(212,167,44,0.4)] transition-all duration-300 ease-luxe hover:brightness-110 hover:shadow-[0_0_32px_rgba(212,167,44,0.55)] active:scale-95"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                        Case Study
                      </button>
                    )}

                    {/* ── Overlay caption ──────────────────────────────────── */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="font-display text-xl sm:text-2xl text-parchment font-medium leading-snug line-clamp-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                          {project.displayTitle ?? project.title}
                        </h3>
                        <span className="shrink-0 font-mono text-[10px] tabular-nums tracking-wide text-parchment/70">
                          {pad(index + 1)}&thinsp;/&thinsp;{pad(projects.length)}
                        </span>
                      </div>
                      <p className="mt-2 font-sans text-xs sm:text-sm text-parchment/70 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Arrow Buttons ─────────────────────────────────────────────── */}
        <button
          type="button"
          data-no-drag
          disabled={projects.length < 2}
          onClick={() => go(-1)}
          className="group absolute left-2 sm:left-4 z-[200] flex h-11 w-11 items-center justify-center rounded-full bg-ink/80 border border-gold/25 text-parchment backdrop-blur-xl shadow-stage transition-all duration-300 ease-luxe hover:border-gold/70 hover:text-gold hover:bg-plum/80 hover:shadow-gold-ring hover:scale-105 active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Previous project"
        >
          <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </button>
        <button
          type="button"
          data-no-drag
          disabled={projects.length < 2}
          onClick={() => go(1)}
          className="group absolute right-2 sm:right-4 z-[200] flex h-11 w-11 items-center justify-center rounded-full bg-ink/80 border border-gold/25 text-parchment backdrop-blur-xl shadow-stage transition-all duration-300 ease-luxe hover:border-gold/70 hover:text-gold hover:bg-plum/80 hover:shadow-gold-ring hover:scale-105 active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
          aria-label="Next project"
        >
          <ChevronRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>

      {/* ── Progress rail + dots + Behance link ───────────────────────────── */}
      <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:justify-center items-center gap-4 sm:gap-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-parchment/80 tabular-nums">
            {pad(active + 1)}
          </span>
          <div className="relative h-[2px] w-32 sm:w-44 rounded-full bg-gold/[0.12] overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gold-sheen shadow-[0_0_10px_rgba(212,167,44,0.7)]"
              style={{ width: `${100 / projects.length}%` }}
              animate={{ x: `${active * 100}%` }}
              transition={prefersReducedMotion ? { duration: 0 } : SPRING}
            />
          </div>
          <span className="font-mono text-[10px] text-smoke tabular-nums">
            {pad(projects.length)}
          </span>
        </div>

        <div className="flex items-center" role="group" aria-label="Project slides">
          {projects.map((project, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Project ${idx + 1}: ${project.title}`}
              aria-current={idx === active ? 'true' : undefined}
              className="flex h-8 w-8 items-center justify-center rounded-full"
            >
              <motion.span
                aria-hidden="true"
                className="block h-1.5 w-6 rounded-full bg-gold"
                initial={false}
                animate={{ scaleX: idx === active ? 1 : 0.25, opacity: idx === active ? 1 : 0.35 }}
                transition={prefersReducedMotion ? { duration: 0 } : SPRING}
              />
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.a
              key={activeProject.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22 }}
              href={activeProject.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-smoke hover:text-gold transition-colors"
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
