'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function ParallaxImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  priority = false,
}: ParallaxImageProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  useEffect(() => {
    setMounted(true);
  }, []);

  const still = mounted && prefersReducedMotion;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={still ? { y: 0 } : { y }} className="absolute inset-[-8%]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover object-center"
        />
      </motion.div>
    </div>
  );
}
