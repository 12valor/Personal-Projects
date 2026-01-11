/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Change this line:
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
  },
};

export default config;