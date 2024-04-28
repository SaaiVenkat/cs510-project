/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    "./src/**/*.{js,jsx,ts,tsx}",  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'pacifico': ['Pacifico', 'cursive'],
      },
      colors: {
        'custom-blue': '#143d59',
      }
    },
  },
  plugins: [],
}

