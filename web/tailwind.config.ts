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
        // Core dark palette
        void: "#030A05",
        forest: {
          950: "#040C06",
          900: "#071209",
          800: "#0D1F10",
          700: "#132B17",
          600: "#1A3D1F",
          500: "#235229",
          400: "#2D6A34",
        },
        // Accent system
        venom: {
          DEFAULT: "#22C55E",
          dim: "#15803D",
          glow: "#4ADE80",
        },
        danger: {
          DEFAULT: "#EF4444",
          dim: "#991B1B",
          glow: "#FCA5A5",
        },
        warning: {
          DEFAULT: "#F59E0B",
          dim: "#92400E",
          glow: "#FCD34D",
        },
        safe: {
          DEFAULT: "#A78BFA",
          dim: "#4C1D95",
        },
        // Text
        parchment: "#F0FDF4",
        mist: "#D1FAE5",
        smoke: "#6B7280",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "scales-pattern": "url('/patterns/scales.svg')",
        "hero-gradient":
          "radial-gradient(ellipse at top left, #132B17 0%, #030A05 50%, #040C06 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "danger-gradient":
          "radial-gradient(ellipse at center, #450A0A 0%, #030A05 70%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "scale-breathe": "scaleBreathe 4s ease-in-out infinite",
        "glow-red": "glowRed 2s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scaleBreathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
        glowRed: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(239,68,68,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(239,68,68,0.8), 0 0 80px rgba(239,68,68,0.3)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
