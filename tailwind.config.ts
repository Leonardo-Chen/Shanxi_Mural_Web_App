import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "#D8D0C2",
        ink: "#26241F",
        cinnabar: "#8B352E",
        stone: "#3E6264",
        ochre: "#A2643E",
        rice: "#EEE8DC",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Songti SC", "SimSun", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
