/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyemerald: {
          100: "#cffff2",
          200: "#9fffe5",
          300: "#6fffd9",
          400: "#3fffcc",
          500: "#0fffbf",
          600: "#0ccc99",
          700: "#099973",
          800: "#06664c",
          900: "#033326"
        },


      },
      fontFamily: {
        'main': 'main',
        'sub': 'sub'
      },
      keyframes: {

        'semipulse': {
          '50%': {
            'opacity': 0.75
          }
        }
      },
      animation: {
        'semipulse': 'semipulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
};
