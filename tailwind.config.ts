import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: { extend: { colors: { coal: "#20211D", parchment: "#E8DECA", archiveRed: "#8E3C32", geological: "#64736A" } } },
  plugins: []
};
export default config;
