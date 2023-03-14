/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.35)',
        '4xl': [
            '0 35px 35px rgba(0, 0, 0, 0.5)',
            '0 45px 65px rgba(0, 0, 0, 0.5)'
        ]
      },
      colors: {
        'primary': {
          "50": "#e6fafa",
          "100": "#c2f1f1",
          "200": "#9be7e7",
          "300": "#70dddd",
          "400": "#47d3d3",
          "500": "#1ec9c9",
          "600": "#1cb2b2",
          "700": "#198a8a",
          "800": "#166262",
          "900": "#133a3a"
        }
      }
    },
  },
  plugins: [],
}
