import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':      'radial-gradient(ellipse 90% 60% at 50% -5%, rgba(139,92,246,0.22), transparent 70%)',
        'hero-glow-sm':   'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(139,92,246,0.15), transparent 70%)',
        'card-shine':     'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
      },
      animation: {
        'shimmer':    'shimmer 1.8s linear infinite',
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.35s ease-out forwards',
        'scale-in':   'scaleIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glow':       '0 0 0 1px rgba(139,92,246,0.3), 0 0 40px rgba(139,92,246,0.12)',
        'glow-sm':    '0 0 0 1px rgba(139,92,246,0.25), 0 0 16px rgba(139,92,246,0.08)',
        'card':       '0 1px 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(255,255,255,0.06)',
        'card-hover': '0 0 0 1px rgba(139,92,246,0.35), 0 8px 32px rgba(0,0,0,0.5)',
        'input':      '0 0 0 1px rgba(255,255,255,0.06), 0 2px 4px rgba(0,0,0,0.3)',
        'input-focus':'0 0 0 2px rgba(139,92,246,0.4)',
        'button':     '0 1px 0 rgba(255,255,255,0.1) inset, 0 1px 3px rgba(0,0,0,0.3)',
        'panel':      '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.4)',
        'light-card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'light-card-hover': '0 4px 16px rgba(0,0,0,0.09), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
