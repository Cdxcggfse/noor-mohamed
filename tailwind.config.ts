import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B0A0F',
        void: '#07060B',
        plum: '#1A1220',
        gold: '#D4A72C',
        'gold-light': '#F1D488',
        'gold-deep': '#9C7414',
        rose: '#C97B72',
        violet: '#5B3A66',
        parchment: '#F3ECDF',
        smoke: '#9A93A6',
        glass: 'rgba(243,236,223,0.04)',
        'glass-border': 'rgba(212,167,44,0.14)',
        'glass-border-hover': 'rgba(212,167,44,0.35)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 35px -5px rgba(212, 167, 44, 0.25)',
        'glow-lg': '0 0 60px -10px rgba(212, 167, 44, 0.35)',
        'rose-glow': '0 0 35px -5px rgba(201, 123, 114, 0.25)',
        card: '0 1px 0 0 rgba(243,236,223,0.05) inset, 0 18px 40px -24px rgba(0,0,0,0.9), 0 4px 14px -6px rgba(0,0,0,0.6)',
        'card-hover':
          '0 1px 0 0 rgba(243,236,223,0.08) inset, 0 0 0 1px rgba(212,167,44,0.16), 0 30px 60px -30px rgba(0,0,0,0.95), 0 10px 40px -18px rgba(212,167,44,0.22)',
        stage: '0 60px 90px -60px rgba(0,0,0,1), 0 30px 70px -40px rgba(212,167,44,0.16)',
        'stage-active':
          '0 0 0 1px rgba(212,167,44,0.3), 0 2px 0 0 rgba(241,212,136,0.14) inset, 0 40px 80px -40px rgba(0,0,0,1), 0 0 70px -12px rgba(212,167,44,0.22)',
        'stage-side': '0 30px 60px -40px rgba(0,0,0,0.95), 0 1px 0 0 rgba(243,236,223,0.04) inset',
        'gold-ring': '0 0 0 1px rgba(212,167,44,0.28), 0 0 24px -4px rgba(212,167,44,0.4)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(135deg, #F6E3A8 0%, #D4A72C 42%, #B58A19 68%, #F1D488 100%)',
        'gold-line':
          'linear-gradient(90deg, transparent 0%, rgba(212,167,44,0.55) 50%, transparent 100%)',
        'hairline': 'linear-gradient(90deg, transparent, rgba(212,167,44,0.28), transparent)',
        'radial-fade':
          'radial-gradient(ellipse at center, rgba(212,167,44,0.16) 0%, rgba(91,58,102,0.1) 45%, transparent 75%)',
        'card-sheen':
          'linear-gradient(180deg, rgba(243,236,223,0.09) 0%, rgba(243,236,223,0.02) 18%, transparent 42%)',
        'stage-floor':
          'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 45%, transparent 72%)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'luxe-soft': 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        shimmer: 'shimmer 6.5s linear infinite',
        sheen: 'sheen 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-breathe': 'glowBreathe 7s ease-in-out infinite',
        'rise-in': 'riseIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        sheen: {
          '0%': { transform: 'translateX(-140%) skewX(-18deg)', opacity: '0' },
          '12%': { opacity: '0.55' },
          '100%': { transform: 'translateX(240%) skewX(-18deg)', opacity: '0' },
        },
        glowBreathe: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.05)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
