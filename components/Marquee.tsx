'use client';

import React from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion';

interface MarqueeProps {
  items: string[];
}

const BASE_SPEED = 2.4;

export default function Marquee({ items }: MarqueeProps) {
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 3], { clamp: false });

  // The track holds four identical copies, so one period is 25% of its width.
  // baseX only ever decreases, keeping the wrapped value inside (-25%, 0] — no gaps,
  // and the remaining three copies keep wide viewports covered through the loop.
  const x = useTransform(baseX, (value) => `${value % 25}%`);

  useAnimationFrame((_, delta) => {
    if (prefersReducedMotion) return;

    const boost = Math.min(Math.abs(velocityFactor.get()), 3);
    baseX.set(baseX.get() - BASE_SPEED * (1 + boost) * (delta / 1000));
  });

  const track = [...items, ...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-gold/10 bg-ink py-8 sm:py-12 select-none"
    >
      {/* Edge fades into the page background */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(to right, #0B0A0F 0%, rgba(11,10,15,0) 14%, rgba(11,10,15,0) 86%, #0B0A0F 100%)',
        }}
      />

      <motion.div
        style={{ x }}
        className="flex w-max items-center will-change-transform"
      >
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center">
            <span
              className={`font-display text-2xl sm:text-4xl lg:text-5xl tracking-tight whitespace-nowrap mx-6 sm:mx-10 ${
                index % 2 === 0 ? 'text-parchment' : 'text-transparent'
              }`}
              style={
                index % 2 === 0
                  ? undefined
                  : { WebkitTextStroke: '1px rgba(212,167,44,0.5)' }
              }
            >
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold/50 shrink-0" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
