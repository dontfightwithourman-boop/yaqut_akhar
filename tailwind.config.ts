import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ruby: { DEFAULT: '#C9B896', glow: '#D4C5A8', dark: '#A89870' },
        cream: { DEFAULT: '#FDF0D5', dark: '#F0E0C0' },
        beige: { DEFAULT: '#C79B69', light: '#D4B08A', dark: '#A87D4F' },
        navy: { DEFAULT: '#003049', light: '#004066', dark: '#001A2B' },
        sky: { DEFAULT: '#669BBC', light: '#8AB5CC', dark: '#4A83A6' },
      },
      fontFamily: {
        edameh: ['var(--font-edameh)', 'system-ui', 'sans-serif'],
        yekan: ['var(--font-yekan)', 'var(--font-yekan-semibold)', 'var(--font-yekan-bold)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
