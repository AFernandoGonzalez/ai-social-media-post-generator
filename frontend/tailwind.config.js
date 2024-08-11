/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        darkBackground: '#1a202c', 
        lightBackground: '#ffffff', 
        darkText: '#ffffff',
        lightText: '#1a202c',
        darkHover: '#2d3748', 
        lightHover: '#edf2f7', 
      },
    },
  },
  plugins: [],
}
