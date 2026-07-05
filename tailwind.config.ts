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
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#00A86B",
          700: "#006B3C",
          800: "#005a32",
          900: "#003d22",
          950: "#001f11",
        },
        brand: {
          primary: "#006B3C",
          secondary: "#00A86B",
          light: "#E8F5EE",
          gold: "#F59E0B",
          dark: "#1A2E1A",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "hero-pattern": "linear-gradient(135deg, #006B3C 0%, #00A86B 50%, #004d2b 100%)",
        "card-gradient": "linear-gradient(135deg, #E8F5EE 0%, #ffffff 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "card": "0 4px 24px rgba(0, 107, 60, 0.08)",
        "card-hover": "0 8px 40px rgba(0, 107, 60, 0.16)",
        "green": "0 4px 20px rgba(0, 168, 107, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
