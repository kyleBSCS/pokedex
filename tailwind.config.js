/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        ibm: ["var(--font-ibm-plex-sans-condensed)", "sans-serif"],
        "league-gothic": ["var(--font-league-gothic)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
