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
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: '#6756C3', 
        secondary2: '#31295D', 
        primary: '#972E7C', 

      },
      fontFamily: {
        'TheYearofTheCamel': ['TheYearofTheCamel', 'Arial', 'Helvetica', 'sans-serif'],
      },
    },
    plugins: [
      require('tailwind-scrollbar'),
      // Optionally you can enable rounded scrollbars by using the following:
      require('tailwind-scrollbar')({ nocompatible: true }),
    ],
  },
  plugins: [],
};
export default config;
