/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF69B4',
        'primary-dark': '#FF1493',
        accent: '#4B0082',
        'accent-light': '#9370DB',
        pastel: {
          pink: '#FFB6C1',
          purple: '#DDA0DD',
          blue: '#B0C4DE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
