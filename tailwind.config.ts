import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          "Georgia",
          "ui-serif",
          "serif",
          '"Times New Roman"',
          "Times",
          "serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          '"Open Sans"',
          '"Helvetica Neue"',
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;

