/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src//*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2979FF",
        accentPink: "#FF6B6B",
        accentOrange: "#FF9154",
        accentPurple: "#9D4EDD",
      },
    },
  },
  plugins: [],
};