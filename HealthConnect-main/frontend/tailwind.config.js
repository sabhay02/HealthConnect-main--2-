/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        bounce: 'bounce 1s infinite',
      },
      transformStyle: {
        '3d': 'preserve-3d',
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
      transform: {
        'rotate-y-180': 'rotateY(180deg)',
      },
    },
  },
  plugins: [],
};