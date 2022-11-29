/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

      maxHeight: {
        header: '90px',
        main: 'calc(100vh - 90px)'
      },
      height: {
        header: '90px',
        main: 'calc(100vh - 90px)'
      },

      colors: {
        cyemerald: `#3fffcc`,
        cyemeraldHover: `#05c8cf`,

      },
      backgroundColor: {
        html: `#000`,
        header: `#00004f`,
        main: `#01000a`
      },
      fontFamily: {
        main: 'main',
        sub: 'sub',
        flat: 'flat'
      },
      keyframes: {

        'semipulse': {
          '50%': {
            'opacity': 0.85
          }
        }
      },
      animation: {
        semipulse: 'semipulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
};
