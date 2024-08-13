/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        light: {
          background: '#F8F9FA',  // Background color
          surface: '#FFFFFF',     // Surface color (for cards, modals, etc.)
          textPrimary: '#212529',  // Primary text color
          textSecondary: '#343A40',  // Secondary text color
          textTertiary: '#495057',  // Tertiary text color (less prominent text)
          hover: '#DEE2E6',  // Hover state color
          active: '#CED4DA',  // Active state color
          border: '#ADB5BD',  // Border color
          divider: '#CED4DA',  // Divider line color
          muted: '#6C757D',  // Muted text color
        },
        dark: {
          background: '#212529',  // Background color
          surface: '#343A40',     // Surface color (for cards, modals, etc.)
          textPrimary: '#F8F9FA',  // Primary text color
          textSecondary: '#DEE2E6',  // Secondary text color
          textTertiary: '#CED4DA',  // Tertiary text color (less prominent text)
          hover: '#495057',  // Hover state color
          active: '#6C757D',  // Active state color
          border: '#ADB5BD',  // Border color
          divider: '#495057',  // Divider line color
          muted: '#6C757D',  // Muted text color
        },

        main: {
          accent: '#eb5e28',  // Accent color for buttons, links, etc.
        },


        common: {
          transparent: 'transparent',  // Transparent utility
          black: '#000000',  // Black color
          white: '#ffffff',  // White color
        },
      },
    },
  },
  plugins: [],
}
