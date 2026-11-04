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
        navy: {
          50: "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#1E3E62",
          900: "#0B192C",
          950: "#060D17",
        },
        brand: {
          primary: "#0B192C",
          secondary: "#1E3E62",
          accent: "#F97316", // Vibrant orange accent
          accentHover: "#EA580C",
          yellow: "#FBBF24",
          surface: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        heading: ["system-ui", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
