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
        // The done accent. Green means today is finished, orange means the run
        // is still live. The two never appear on the same card.
        sage: {
          100: "#e2f0e0",
          300: "#a6c3a2",
          500: "#57a45f",
          700: "#3a7742",
          900: "#27562d",
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
