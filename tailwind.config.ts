import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-mode="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
