/// <reference types="nativewind/types" />
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  important: true,
  corePlugins: {
    blur: true,
  },
  theme: {
    extend: {
      blur: {
        lg: '20px',
      },
      colors: {
        primary: '#F7F7F7',
        'blue-primary': '#8FD7FF',
        'blue-secondary': '#A5D1EA',
        'blue-tertiary': '#B4CFE6',
        'blue-dark-primary': '#6d7eac',
        'blue-dark-secondary': '#798CBF',
        gray: '#E9EAEB',
        'gray-light': '#F1F1F1',
        'gray-opacity': '#e6e6e6',
        'beige-primary': '#EBDCBF',
        'beige-secondary': '#F5E2CEB2',
        'calendar-dot': '#FFCACD',
        white: '#fff',
        error: '#FFB0B5',
      },
    },
  },
  plugins: [],
};
