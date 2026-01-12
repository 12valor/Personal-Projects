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
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      // You can remove the dark colors if you want to keep the config file clean
      boxShadow: {
        'panel': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
        'panel-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("tailwind-scrollbar-hide"), 
  ],
};
export default config;