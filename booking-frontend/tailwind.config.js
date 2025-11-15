/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src//*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2979FF",
        secondary: "#FF6B6B",
        accent: "#FF9154",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(to bottom right, #2979FF, #6366F1, #06B6D4)",
      },
    },
  },
  plugins: [],
};