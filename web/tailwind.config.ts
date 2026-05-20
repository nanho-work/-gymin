import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121514",
        forest: "#12392f",
        green: "#1f8f5f",
        mint: "#43d28c",
        line: "#dfe7e2",
        paper: "#f6f8f7",
        muted: "#63706a"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(18, 21, 20, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
