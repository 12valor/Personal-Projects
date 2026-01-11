import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"],
      },
      colors: {
        banana: {
          100: "#FEF9C3", // Soft background highlight
          400: "#FACC15", // Main banana yellow
          500: "#EAB308", // Hover state
        },
        ink: {
          900: "#1C1917", // Primary text (Stone-900)
          500: "#78716C", // Secondary labels (Stone-500)
        }
      }
    },
  },
  plugins: [],
};
export default config;