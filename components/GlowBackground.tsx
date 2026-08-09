'use client';

import React from 'react';

interface GlowBackgroundProps {
  position?: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right' | 'hero' | 'contact';
  opacity?: number;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'xl';
  colorTheme?: 'gold-blend' | 'rose-blend' | 'violet-blend';
  className?: string;
}

export default function GlowBackground({
  position = 'center',
  opacity = 0.15,
  size = 'lg',
  colorTheme = 'gold-blend',
  className = '',
}: GlowBackgroundProps) {
  // Size mapping
  const sizeClasses = {
    sm: 'w-[300px] h-[300px] blur-[80px]',
    md: 'w-[450px] h-[450px] blur-[100px]',
    lg: 'w-[650px] h-[650px] blur-[140px]',
    xl: 'w-[850px] h-[850px] blur-[160px]',
    hero: 'w-[500px] sm:w-[700px] lg:w-[900px] h-[500px] sm:h-[700px] lg:h-[900px] blur-[140px]',
  };

  // Position mapping
  const posClasses = {
    'top-left': '-top-20 -left-20',
    'top-right': '-top-20 -right-20',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-left': '-bottom-20 -left-20',
    'bottom-right': '-bottom-20 -right-20',
    hero: 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2',
    contact: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Noise Overlay */}
      <div className="absolute inset-0 bg-noise opacity-100 z-10" />

      {/* Primary Radial Glow Orb */}
      <div
        className={`absolute rounded-full transition-opacity duration-1000 ${sizeClasses[size]} ${posClasses[position]} ${className}`}
        style={{
          opacity,
          background:
            colorTheme === 'gold-blend'
              ? 'radial-gradient(circle, rgba(212,167,44,0.8) 0%, rgba(201,123,114,0.4) 45%, rgba(91,58,102,0.2) 80%, transparent 100%)'
              : colorTheme === 'rose-blend'
              ? 'radial-gradient(circle, rgba(201,123,114,0.8) 0%, rgba(91,58,102,0.5) 50%, rgba(212,167,44,0.2) 80%, transparent 100%)'
              : 'radial-gradient(circle, rgba(91,58,102,0.8) 0%, rgba(212,167,44,0.4) 50%, rgba(201,123,114,0.2) 80%, transparent 100%)',
        }}
      />
    </div>
  );
}
