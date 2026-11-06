import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          black: "#080808",
          dark: "#0F0F0F",
          charcoal: "#161616",
          surface: "#1E1E1E",
          gold: "#D9A441",
          goldLight: "#F5D58A",
          goldDark: "#A4741E",
          cream: "#F7F0E5",
          creamSoft: "#FAF6F0",
          creamDark: "#E8DECE",
        },
        gold: {
          50: "#FCF8EC",
          100: "#F9F0D4",
          200: "#F5E3AA",
          300: "#F0D580",
          400: "#E5BE53",
          500: "#D9A441",
          600: "#B8832A",
          700: "#91621E",
          800: "#6B4616",
          900: "#442A0D",
        },
      },
      fontFamily: {
        serif: ["Cinzel", "Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F5D58A 0%, #D9A441 50%, #A4741E 100%)",
        "gold-radial": "radial-gradient(ellipse at top, #F5D58A 0%, #D9A441 60%, #8C5E13 100%)",
        "dark-radial": "radial-gradient(circle at center, #1A1A1A 0%, #080808 100%)",
        "luxury-pattern": "radial-gradient(rgba(217, 164, 65, 0.08) 1px, transparent 1px)",
      },
      boxShadow: {
        "gold-sm": "0 0 15px rgba(217, 164, 65, 0.15)",
        "gold-md": "0 4px 25px rgba(217, 164, 65, 0.25)",
        "gold-lg": "0 10px 40px rgba(217, 164, 65, 0.35)",
        "inner-gold": "inset 0 0 15px rgba(217, 164, 65, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "shimmer": "shimmer 2.5s infinite linear",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

