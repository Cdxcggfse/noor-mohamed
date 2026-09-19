'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface VisualInterludeProps {
  imageSrc: string;
  title: string;
  tag: string;
  href: string;
}

export default function VisualInterlude({ imageSrc, title, tag, href }: VisualInterludeProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [1.14, 1.03, 1.12]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Held back until after hydration so the server and first client render agree.
  const still = mounted && prefersReducedMotion;

  return (
    <section className="relative bg-ink border-t border-gold/10" aria-labelledby="interlude-heading">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-hairline z-20" />
      <div
        ref={ref}
        className="relative w-full h-[58vh] min-h-[360px] sm:h-[78vh] overflow-hidden"
      >
        {/* Parallax image sits oversized so no edge is ever exposed */}
        <motion.div style={still ? { y: 0, scale: 1 } : { y, scale }} className="absolute inset-[-9%]">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Cinematic vignette + grain */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        <div className="absolute inset-0 bg-noise opacity-100 pointer-events-none" />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 120%, rgba(212,167,44,0.14) 0%, transparent 55%)',
          }}
        />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col justify-end pb-10 sm:pb-16">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-gold font-medium">
            {tag}
          </span>
          <h2
            id="interlude-heading"
            className="font-display text-3xl sm:text-5xl lg:text-6xl text-parchment leading-[1.1] font-normal mt-3 max-w-3xl"
          >
            {title}
          </h2>
          <Link
            href={href}
            className="group mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-parchment hover:text-gold transition-colors duration-500 w-fit"
          >
            View case study
            <ArrowUpRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500 ease-luxe" />
          </Link>
        </div>
      </div>
    </section>
  );
}
