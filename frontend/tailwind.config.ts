import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1e293b",
        blush: "#f8e7e7",
        rosewood: "#8f3f46",
        sage: "#66785f",
        pearl: "#fffaf7"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(31, 41, 55, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
