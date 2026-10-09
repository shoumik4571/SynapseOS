/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nvidia: {
          green: "#76B900",
          dark: "#5A8F00",
          glow: "rgba(118, 185, 0, 0.25)",
        },
        nebius: {
          cyan: "#00E5FF",
          violet: "#7C4DFF",
          dark: "#0F172A",
        },
      },
    },
  },
  plugins: [],
}
