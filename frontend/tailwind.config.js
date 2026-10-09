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
        obsidian: {
          950: "#030014", // Deep void cosmos black
          900: "#070417", // Obsidian purple-black
          850: "#0c0822",
          800: "#120d2e",
          750: "#1a123f",
          700: "#241852",
        },
        synapse: {
          purple: "#A855F7",
          violet: "#8B5CF6",
          indigo: "#6366F1",
          magenta: "#D946EF",
          neon: "#C084FC",
          glow: "rgba(168, 85, 247, 0.35)",
        },
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
      backgroundImage: {
        'purple-radial': 'radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15) 0%, rgba(3, 0, 20, 0) 70%)',
        'purple-glow-card': 'radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(168, 85, 247, 0.12), transparent 40%)',
      },
      animation: {
        'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 25s linear infinite',
        'spin-reverse': 'spin-reverse 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
