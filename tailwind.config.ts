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
        ink: "var(--color-ink)",
        cinnabar: "var(--color-vermiglio)",
        vermiglio: "var(--color-vermiglio)",
        gold: "var(--color-gold)",
        parchment: "var(--color-background)",
        rice: "var(--color-surface)",
        stone: "var(--color-ink)",
        ochre: "var(--color-gold)",
        surface: "var(--color-surface)",
        "on-accent": "var(--color-on-accent)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        sans: [
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        serif: [
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        "ui-cn": [
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        "ui-western": [
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        "editorial-cn": [
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        "editorial-western": [
          "MiSans",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
      },
      boxShadow: {
        hover: "0 12px 28px var(--color-shadow)",
        figure: "0 14px 36px rgb(33 51 56 / 14%)",
        overlay: "0 20px 48px rgb(33 51 56 / 18%)",
      },
      borderRadius: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
