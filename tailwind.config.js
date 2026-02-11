/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        paper: "#F5F5F0",
        concrete: "#EEEEEC",
        ink: "#1A1A1A",
        signal: "#FF4D00",
        structural: "#D1D1D1",
      },
    },
  },
  plugins: [],
};
