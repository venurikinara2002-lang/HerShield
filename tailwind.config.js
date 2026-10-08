/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFF8F9',
        card: '#FFFFFF',
        primary: '#E06287',
        textslate: '#2D3748',
        tint: '#FCE4EC',
        quickexit: '#2D3748',
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Noto Sans Sinhala"', '"Noto Sans Tamil"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
