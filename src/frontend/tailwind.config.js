import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        "forge-blue": "#0051ff",
        "forge-blue-lt": "#3374ff",
        "forge-blue-pale": "#e8eeff",
        "forge-blue-faint": "#f0f4ff",
        "forge-surface": "#f4f6fb",
        "forge-card": "#eef1f8",
        "forge-text-primary": "#0d1117",
        "forge-text-secondary": "#4a5568",
        "forge-text-muted": "#9aa0b4",
        "forge-border": "#dde2ef",
        "forge-green": "#16a34a",
        "forge-green-pale": "#dcfce7",
        "forge-red": "#dc2626",
        "forge-amber": "#d97706",
        "forge-amber-pale": "#fef3c7",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "20px",
        md: "12px",
        sm: "8px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "sm": "0 1px 4px rgba(0,0,0,0.04)",
        "default": "0 4px 24px rgba(0,0,0,0.06)",
        "bento": "0 20px 60px rgba(0,81,255,0.12)",
        "featured": "0 0 60px rgba(0,81,255,0.08), 0 30px 80px rgba(0,81,255,0.15)",
        "browser": "0 40px 100px rgba(0,0,0,0.08)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scroll-reveal": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer-sweep": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "scroll-reveal": "scroll-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shimmer-sweep": "shimmer-sweep 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "marquee": "marquee 28s linear infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
