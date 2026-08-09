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
        plum: '#1A1220',
        gold: '#D4A72C',
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
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
