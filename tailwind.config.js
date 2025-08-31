/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#50FF9F',
          foreground: '#111814',
        },
        background: {
          DEFAULT: '#111814',
          card: '#1A221E',
        },
        text: {
          primary: '#E0E0E0',
          secondary: '#A0A0A0',
        },
        border: '#333C37',
        status: {
          success: '#50FF9F',
          error: '#FF5B5B',
          warning: '#FFB800',
        },
      },
    },
  },
  plugins: [],
}
  