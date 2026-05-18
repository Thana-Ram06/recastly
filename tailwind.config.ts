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
          50:  '#f3f0ff',
          100: '#e9e3ff',
          200: '#d4c9ff',
          300: '#b9a8ff',
          400: '#9b87fd',
          500: '#7c5cfc',
          600: '#6b4ae8',
          700: '#5739cc',
          800: '#432ba6',
          900: '#311e7c',
          950: '#1a0f45',
        },
        surface: {
          1: '#111118',
          2: '#17171f',
          3: '#1e1e2c',
        },
        // Override zinc-950 so all existing bg-zinc-950 refs get the new charcoal
        zinc: {
          950: '#0c0c12',
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':        'radial-gradient(ellipse 80% 55% at 50% -10%, rgba(124,92,252,0.22), transparent 68%)',
        'hero-glow-sm':     'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,92,252,0.16), transparent 70%)',
        'card-shine':       'linear-gradient(135deg, rgba(255,255,255,0.035) 0%, transparent 60%)',
        'button-shine':     'linear-gradient(180deg, rgba(255,255,255,0.13) 0%, transparent 100%)',
        'gradient-brand':   'linear-gradient(135deg, #7c5cfc 0%, #6b4ae8 100%)',
        'gradient-aurora':  'linear-gradient(135deg, rgba(124,92,252,0.15) 0%, rgba(91,140,255,0.08) 100%)',
      },
      animation: {
        'shimmer':    'shimmer 2s linear infinite',
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'scale-in':   'scaleIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3.5s ease-in-out infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow':             '0 0 0 1px rgba(124,92,252,0.3), 0 0 48px rgba(124,92,252,0.14)',
        'glow-sm':          '0 0 0 1px rgba(124,92,252,0.22), 0 0 20px rgba(124,92,252,0.09)',
        'glow-md':          '0 0 0 1px rgba(124,92,252,0.28), 0 0 36px rgba(124,92,252,0.12)',
        'card':             '0 1px 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(255,255,255,0.07)',
        'card-hover':       '0 0 0 1px rgba(124,92,252,0.35), 0 8px 40px rgba(0,0,0,0.55)',
        'card-elevated':    '0 2px 0 rgba(255,255,255,0.05) inset, 0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.5)',
        'input':            '0 0 0 1px rgba(255,255,255,0.07), 0 2px 4px rgba(0,0,0,0.3)',
        'input-focus':      '0 0 0 2.5px rgba(124,92,252,0.38)',
        'button':           '0 1px 0 rgba(255,255,255,0.1) inset, 0 1px 3px rgba(0,0,0,0.4)',
        'button-primary':   '0 0 0 1px rgba(124,92,252,0.55), 0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 20px rgba(124,92,252,0.22)',
        'button-primary-hover': '0 0 0 1px rgba(124,92,252,0.65), 0 1px 0 rgba(255,255,255,0.15) inset, 0 6px 28px rgba(124,92,252,0.3)',
        'panel':            '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.5)',
        'elevated':         '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.45), 0 24px 64px rgba(0,0,0,0.35)',
        'light-card':       '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        'light-card-hover': '0 4px 18px rgba(0,0,0,0.1), 0 2px 5px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
