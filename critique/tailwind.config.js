import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Added strictly for safety
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Added strictly for safety
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        panel: "var(--panel)",
        border: "var(--border)",
        ytRed: "#FF0033",
      },
      boxShadow: {
        "yt-glow": "0 0 15px rgba(255, 0, 51, 0.5)",
        "tactile": "4px 4px 0px rgba(0,0,0,0.5)",
      },
    },
  },
  extend: {
  keyframes: {
    scanline: {
      '0%': { top: '0%' },
      '100%': { top: '100%' },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0) translateX(-50%)' },
      '50%': { transform: 'translateY(-20px) translateX(-50%)' },
    }
  },
  animation: {
    scanline: 'scanline 8s linear infinite',
    float: 'float 6s ease-in-out infinite',
  }
},
  plugins: [],
};
export default config;