import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff5ea",
          100: "#ffe0c7",
          500: "#ff9327",
          700: "#c2560f",
          900: "#8b3a0e",
        },
        beige: {
          100: "#f6ece2",
          500: "#c9a580",
          900: "#5a4632",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.625rem",
      },
    },
  },
  plugins: [],
};

export default config;
