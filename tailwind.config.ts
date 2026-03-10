import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: "#f8f6f2",
        ink: "#111111",
        clay: "#b8672c",
        moss: "#5a7a6f",
        sun: "#f2d18f"
      },
      boxShadow: {
        card: "0 20px 60px rgba(16, 24, 40, 0.15)"
      }
    }
  },
  plugins: []
};

export default config;
