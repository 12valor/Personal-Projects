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
        // Added "sans-serif" fallback for better performance/reliability
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      // New "Premium" Shadow for your dashboard panels
      boxShadow: {
        'panel': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
        'panel-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      colors: {
        // You can keep your Banana/Ink branding, or mix them with Slate
        banana: {
          100: "#FEF9C3",
          400: "#FACC15",
          500: "#EAB308",
        },
        ink: {
          900: "#1C1917",
          500: "#78716C",
        }
      }
    },
  },
  plugins: [
    // If you haven't installed it, run: npm install -D tailwindcss-animate
    // This powers the "animate-in fade-in" effects used in the code
    require("tailwindcss-animate"), 
  ],
};
export default config;