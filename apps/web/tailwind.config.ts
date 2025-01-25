import { heroui } from '@heroui/react';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        header: '4rem',
        main: 'calc(100svh - 4rem)',
      },
      minHeight: {
        main: 'calc(100svh - 4rem)',
      },
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
} satisfies Config;
