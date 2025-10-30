/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primario: {
          50: '#f4f5ff',
          100: '#e5e7ff',
          200: '#c7cbff',
          300: '#a0a7ff',
          400: '#7a82ff',
          500: '#5b63ff',
          600: '#4449db',
          700: '#3435aa',
          800: '#26267a',
          900: '#18194f'
        }
      }
    }
  },
  plugins: []
};
