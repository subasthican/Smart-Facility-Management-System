/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        sf: {
          ink: "#0f172a",
          slate: "#334155",
          muted: "#475569",
          accent: "#0f766e",
          shell: "#dfe8f7",
        },
      },
      boxShadow: {
        shell: "0 22px 44px rgba(15, 23, 42, 0.12)",
        glass: "0 16px 34px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
}

