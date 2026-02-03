import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        tab: "768px",
        pc: "1025px",
      },

      colors: {
        "color-background": "var(--background-color)",
        "color-modal-background": "var(--modal-background-color)",
        "color-form-background": "var(--form-background-color)",
        "color-text": "var(--text-color)",
        "color-subtext": "var(--text-sub-color)",
        "color-border": "var(--border-color)",
        "color-separator": "var(--separator-color)",
        "color-hover": "var(--hover-color)",
        "color-accent": "#E67817",
        "color-accent-dark": "#d76f14",
        "color-dim-white": "#eaeaea",
        "color-white_black": "var(--color-white_black)",
        "color-black_white": "var(--c--color-black_white)",
        "color-table-header": "#0054A4",
        "color-disabled-bg": "var(--disabled-color)",
        "color-disabled-text": "var(--disabled-text-color)",
      },
    },
  },
  plugins: [],
}
export default config
