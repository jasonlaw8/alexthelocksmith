/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.{html,js}', // Scans all HTML and JS files in the folder
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#2C2E6A',
        'brand-blue-darker': '#212352',
        'brand-beige': '#E2DCD3',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}