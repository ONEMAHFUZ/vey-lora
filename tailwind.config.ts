import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#050914", 900: "#0a1128", 800: "#101a3a", 700: "#16224d" },
        electric: "#3b82f6",
        violet2: "#8b5cf6",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg,#0a1128 0%,#1e1b4b 45%,#0ea5e9 130%)",
        "brand-gradient": "linear-gradient(90deg,#8b5cf6,#3b82f6,#06b6d4)",
      },
    },
  },
  plugins: [],
};
export default config;
