import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. Force Poppins as the default sans font
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      // 2. Define your Minimal/Editorial Color Palette
      colors: {
        background: "#FFFFFF", // Pure white
        foreground: "#1A1A1A", // Sharp, editorial black
        accent: {
          DEFAULT: "#2F5E41", // The subtle green you requested
          hover: "#244A32",
          light: "#E8F0EA", // For very subtle backgrounds
        },
        border: "#E5E5E5", // Neutral gray for grid lines
        subtle: "#F5F5F5", // For hover states
      },
      // 3. Strict Border Radius (No "AI-card" blobs)
      borderRadius: {
        DEFAULT: "4px",
        md: "6px",
        lg: "8px", 
      },
    },
  },
  plugins: [],
};
export default config;