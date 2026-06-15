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
        // Google Color Palette
        google: {
          blue: '#4285F4',
          red: '#EA4335',
          yellow: '#FBBC05',
          green: '#34A853',
          orange: '#FF9500',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 0 1px rgba(66,133,244,0.35), 0 18px 50px -12px rgba(66,133,244,0.55)',
        'glow-red': '0 0 0 1px rgba(234,67,53,0.35), 0 18px 50px -12px rgba(234,67,53,0.55)',
        'glow-yellow': '0 0 0 1px rgba(251,188,5,0.35), 0 18px 50px -12px rgba(251,188,5,0.5)',
        'glow-green': '0 0 0 1px rgba(52,168,83,0.35), 0 18px 50px -12px rgba(52,168,83,0.55)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      transitionDuration: {
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
      animation: {
        'scroll': 'scroll 25s linear infinite',
        'aurora': 'aurora 18s ease-in-out infinite',
        'float-slow': 'float-slow 9s ease-in-out infinite',
        'reveal-up': 'reveal-up 0.7s cubic-bezier(0.22,1,0.36,1) both',
        'grid-pan': 'grid-pan 22s linear infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0.85' },
          '33%': { transform: 'translate3d(4%,-3%,0) scale(1.12)', opacity: '1' },
          '66%': { transform: 'translate3d(-3%,3%,0) scale(1.05)', opacity: '0.9' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-22px) translateX(10px)' },
        },
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(26px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'grid-pan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '60px 60px' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
