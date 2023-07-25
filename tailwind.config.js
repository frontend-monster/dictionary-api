/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {},
    fontFamily: {
      mono: ["IBM Plex Mono", "monospace"],
      serif: ["Merriweather", "serif"],
      sans: ["Open Sans", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

