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
        surface: "#0F1117",
        panel: "#161B24",
        border: "#1E2739",
        accent: {
          DEFAULT: "#22C55E",
          dim: "#15803D",
        },
        danger: { DEFAULT: "#EF4444" },
        warning: { DEFAULT: "#F59E0B" },
        info: { DEFAULT: "#60A5FA" },
        text: {
          primary: "#E2E8F0",
          muted: "#64748B",
          faint: "#334155",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
