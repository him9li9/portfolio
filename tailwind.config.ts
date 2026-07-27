import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      spacing: {
        "space-0-5": "2px",
        "space-1": "4px",
        "space-2": "8px",
        "space-3": "12px",
        "space-4": "16px",
        "space-5": "20px",
        "space-6": "24px",
        "space-8": "32px",
        "space-10": "40px",
        "space-12": "48px",
        "space-14": "56px",
        "space-16": "64px",
        "space-30": "120px"
      },
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "bg-card": "var(--color-bg-card)",
        "bg-chips": "var(--color-bg-chips)",
        "bg-elevated": "var(--color-bg-elevated)",
        "bg-elevated-hover": "var(--color-bg-elevated-hover)",
        "bg-elevated-accent": "var(--color-bg-elevated-accent)",
        "border-elevated": "var(--color-border-elevated)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary-background)",
        "text-secondary-elevated": "var(--color-text-secondary-elevated)"
      }
    }
  },
  plugins: []
};

export default config;
