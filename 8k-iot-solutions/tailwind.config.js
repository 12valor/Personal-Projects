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
          500: '#3b82f6',
          700: '#1d4ed8',
          900: '#1e3a8a', 
          950: '#172554',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'], // Sets Inter as the default body font
        poppins: ['var(--font-poppins)', 'sans-serif'], // Keeps Poppins for headings
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        // Add the shine animation here
        'shine': 'shine 1.5s ease-out infinite', 
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Add the shine keyframes here
        shine: {
          '0%': { left: '-100px' },
          '60%': { left: '100%' },
          '100%': { left: '100%' },
        }
      }
    },
  },
  plugins: [],
}