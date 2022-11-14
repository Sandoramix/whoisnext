/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
