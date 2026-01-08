/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Meiryo",
          "sans-serif",
        ],
        serif: [
          "Hiragino Mincho ProN",
          "Yu Mincho",
          "YuMincho",
          "serif",
        ],
      },
    },
  },
  plugins: [],
}

