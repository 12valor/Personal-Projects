/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        background: "#050505",
        panel: "#0A0A0A",
        border: "#1F1F1F",
      },
      boxShadow: {
        'tactile': '0 4px 0 0 #000, 0 8px 16px rgba(0,0,0,0.4)',
        'tactile-pressed': '0 0px 0 0 #000, inset 0 2px 4px rgba(0,0,0,0.8)',
      }
    },
  },
  plugins: [],
};