'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';

interface LitWordProps {
  word: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}

function LitWord({ word, progress, start, end }: LitWordProps) {
  const opacity = useTransform(progress, [start, end], [0.16, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.24em]">
      {word}
    </motion.span>
  );
}

interface ScrollLitTextProps {
  text: string;
  className?: string;
}

export default function ScrollLitText({ text, className = '' }: ScrollLitTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.5'],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const words = text.split(' ');

  // Server render and reduced-motion users get the full text at full contrast.
  if (!mounted || prefersReducedMotion) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <LitWord
            key={`${word}-${index}`}
            word={word}
            progress={scrollYProgress}
            start={index / words.length}
            end={(index + 1) / words.length}
          />
        ))}
      </span>
    </p>
  );
}
