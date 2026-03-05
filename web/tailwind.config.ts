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
        void: "#0A0505",
        forest: {
          950: "#0A0606",
          900: "#120A09",
          800: "#1F1210",
          700: "#2B1A17",
          600: "#3D1F1A",
          500: "#522923",
          400: "#6A342D",
        },
        // Accent system
        venom: {
          DEFAULT: "#DC2626",
          dim: "#991B1B",
          glow: "#F87171",
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
        parchment: "#FFF5F5",
        mist: "#FFE4E6",
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
          "radial-gradient(ellipse at top left, #2B1A17 0%, #0A0505 50%, #0A0606 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "danger-gradient":
          "radial-gradient(ellipse at center, #450A0A 0%, #0A0505 70%)",
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
          "0%, 100%": { boxShadow: "0 0 20px rgba(220,38,38,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(220,38,38,0.8), 0 0 80px rgba(220,38,38,0.3)" },
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
