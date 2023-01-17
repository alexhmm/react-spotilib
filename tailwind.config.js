/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      containers: {
        '8xl': '90rem',
        '9xl': '100rem',
        '10xl': '120rem',
        '11xl': '140rem',
        '12xl': '160rem',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};
