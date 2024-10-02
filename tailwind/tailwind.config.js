/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'midnight-green': '#002F35',
        'dartmouth-green': '#026D3F',
        'pigment-green': '#02B054',
        'beige': '#F9FBE6',
        'jonquil': '#F8CC15',
        'pink': '#F97A93',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

