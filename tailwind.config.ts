import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        brand: "rgb(var(--brand) / <alpha-value>)",
        brandStrong: "rgb(var(--brand-strong) / <alpha-value>)",
        accentTeal: "rgb(var(--accent-teal) / <alpha-value>)",
        accentAmber: "rgb(var(--accent-amber) / <alpha-value>)",
        accentBlue: "rgb(var(--accent-blue) / <alpha-value>)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.05)",
        lift: "0 4px 12px rgba(15, 23, 42, 0.08), 0 16px 32px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
