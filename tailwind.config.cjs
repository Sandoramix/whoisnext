/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "90px": "90px"
      },
      minWidth: {
        "90px": "90px"
      },
      maxHeight: {
        "90px": "90px",
        header: '90px',
        main: 'calc(100vh - 90px)'
      },
      maxWidth: {
        "90px": "90px"
      },
      height: {
        "90px": "90px",
        "80px": "80px",
        header: '90px',
        main: 'calc(100vh - 90px)',
        unknown: "calc(100vw * .05 + 40px)"
      },
      width: {
        unknown: "calc(100vw * .05 + 40px)",
        "90px": "90px",
        "80px": "80px",
      },

      colors: {
        cyemerald: `#3fffcc`,
        cyemeraldHover: `#05c8cf`,

      },
      backgroundColor: {
        html: `#000`,
        header: `#00004f`,
        main: `#01000a`,
        overlay: `#01052e`
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
