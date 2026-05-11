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
        cyber: {
          black:   '#04060f',
          dark:    '#0a0d1a',
          navy:    '#0d1226',
          cyan:    '#00f5ff',
          'cyan-dim': '#00b4d8',
          pink:    '#ff0080',
          'pink-dim': '#cc0066',
          purple:  '#7c00ff',
          'purple-dim': '#5c00cc',
          yellow:  '#ffee00',
          green:   '#00ff88',
          white:   '#e8f4f8',
        },
      },
      fontFamily: {
        mono:    ['var(--font-mono)', 'Courier New', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-grid': `
          linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)
        `,
        'neon-glow-cyan': 'radial-gradient(ellipse at center, rgba(0,245,255,0.15) 0%, transparent 70%)',
        'neon-glow-pink': 'radial-gradient(ellipse at center, rgba(255,0,128,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid-50': '50px 50px',
      },
      animation: {
        'glitch':       'glitch 3s infinite',
        'glitch-2':     'glitch2 3s infinite',
        'scanline':     'scanline 8s linear infinite',
        'pulse-neon':   'pulseNeon 2s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'spin-slow':    'spin 20s linear infinite',
        'flicker':      'flicker 4s linear infinite',
        'type-cursor':  'typeCursor 1s step-end infinite',
        'slide-up':     'slideUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right':  'slideRight 0.8s cubic-bezier(0.16,1,0.3,1) forwards',
        'data-stream':  'dataStream 2s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)' },
          '92%':           { transform: 'translate(-3px, 1px)', filter: 'hue-rotate(90deg)' },
          '94%':           { transform: 'translate(3px, -1px)', filter: 'hue-rotate(-90deg)' },
          '96%':           { transform: 'translate(-2px, 2px)' },
          '98%':           { transform: 'translate(2px, -2px)' },
        },
        glitch2: {
          '0%, 85%, 100%': { clipPath: 'inset(0 0 100% 0)', transform: 'translate(0)' },
          '87%':           { clipPath: 'inset(20% 0 60% 0)', transform: 'translate(4px, 0)', color: '#ff0080' },
          '89%':           { clipPath: 'inset(60% 0 20% 0)', transform: 'translate(-4px, 0)', color: '#00f5ff' },
          '91%':           { clipPath: 'inset(0 0 100% 0)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #00f5ff, 0 0 10px #00f5ff, 0 0 20px #00f5ff' },
          '50%':      { boxShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff, 0 0 80px #00f5ff' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%':           { opacity: '0.4' },
          '97%':           { opacity: '1' },
          '98%':           { opacity: '0.3' },
          '99%':           { opacity: '1' },
        },
        typeCursor: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        dataStream: {
          '0%':   { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
      },
      boxShadow: {
        'neon-cyan':   '0 0 5px #00f5ff, 0 0 20px #00f5ff, 0 0 40px rgba(0,245,255,0.3)',
        'neon-pink':   '0 0 5px #ff0080, 0 0 20px #ff0080, 0 0 40px rgba(255,0,128,0.3)',
        'neon-purple': '0 0 5px #7c00ff, 0 0 20px #7c00ff, 0 0 40px rgba(124,0,255,0.3)',
        'cyber-card':  '0 0 0 1px rgba(0,245,255,0.2), 0 4px 24px rgba(0,245,255,0.1), inset 0 1px 0 rgba(0,245,255,0.1)',
      },
      dropShadow: {
        'neon-cyan': ['0 0 6px #00f5ff', '0 0 20px rgba(0,245,255,0.5)'],
        'neon-pink': ['0 0 6px #ff0080', '0 0 20px rgba(255,0,128,0.5)'],
      },
    },
  },
  plugins: [],
};

export default config;
