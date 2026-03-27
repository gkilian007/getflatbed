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
        gold: "#F5C842",
        "gold-dark": "#E8A800",
        "bg-primary": "#0a0a0f",
        "bg-card": "rgba(255,255,255,0.04)",
        green: {
          400: "#4ADE80",
        },
        red: {
          400: "#F87171",
        },
        blue: {
          400: "#60A5FA",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
