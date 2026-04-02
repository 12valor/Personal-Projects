/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f6ff',
          100: '#e0edff',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a', 
          950: '#172554',
        }
      },
      fontFamily: {
        sans: ['"General Sans"', 'sans-serif'], 
        poppins: ['var(--font-poppins)', 'sans-serif'], 
        boldonse: ['var(--font-boldonse)', 'sans-serif'], 
      },
      animation: {
        // FIXED: Explicitly mapping the animation name to the keyframe
        'fade-in-up': 'fadeInUp 800ms ease-out forwards',
        'blueprintShift': 'blueprintShift 60s linear infinite',
        'scroll-down': 'scrollDown 25s linear infinite',
        'scroll-up': 'scrollUp 25s linear infinite',
        'heroPop': 'heroPop 240ms ease-out forwards',
        'shimmer': 'shimmer 1.4s ease-in-out infinite',
        'scroll-horizontal': 'scrollHorizontal 40s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shine: {
          '0%': { left: '-100px' },
          '60%': { left: '100%' },
          '100%': { left: '100%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        blueprintShift: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(-64px, -64px)' }, 
        },
        scrollDown: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        scrollUp: {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        heroPop: {
          '0%': { opacity: '0', transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        scrollHorizontal: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}