/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        murkoff: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          green: '#2ecc71',
          glitch: '#00ff00',
          blood: '#8a0303',
          paper: '#e2dcca'
        }
      },
      fontFamily: {
        typewriter: ['"Courier New"', 'Courier', 'monospace'],
        sans: ['"Inter"', 'sans-serif']
      },
      animation: {
        flicker: 'flicker 4s infinite',
        glitch: 'glitch 0.2s linear infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.95' },
          '5%': { opacity: '0.85' },
          '10%': { opacity: '0.95' },
          '15%': { opacity: '1' },
          '50%': { opacity: '0.95' },
          '55%': { opacity: '0.9' },
          '60%': { opacity: '1' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        }
      }
    },
  },
  plugins: [],
}
