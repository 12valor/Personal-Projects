/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        panel: "var(--panel)",
        border: "var(--border)",
        foreground: "var(--foreground)",
        // Use this specific hex for maximum saturation
        ytRed: "#FF0000", 
      },
      boxShadow: {
        'tactile': 'var(--shadow-tactile)',
        // Updated glow to be more visible
        'yt-glow': '0 4px 0 0 rgba(0,0,0,0.5), 0 0px 20px rgba(255, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};