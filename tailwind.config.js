/// <reference types="nativewind/types" />
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  important: true,
  darkMode: 'selector',
  corePlugins: {
    blur: true,
  },
  theme: {
    extend: {
      blur: {
        lg: '20px',
      },
      colors: {
        'snow-white': '#f5f8fd',
        black: '#2E3E4B',
        'd-blue-title': '#6E8DBB',
        'd-text-gray': '#9DA3A9',
        primary: '#F7F7F7',
        'd-primary': '#23263F',
        'd-blue-primary': '#373D59',
        'd-blue-primary-dark': '#1F2035',
        'blue-primary': '#8FD7FF',
        'blue-secondary': '#A5D1EA',
        'blue-tertiary': '#B4CFE6',
        'blue-four': '#D4E3FF',
        'blue-baby': '#ECF4FF',
        'blue-dark-primary': '#6d7eac',
        'blue-dark-secondary': '#798CBF',
        'purple-light': '#E7EDF7',
        'purple-dark-primary': '#9194E9',
        'purple-dark-secondary': '#B9BBEF',
        'purple-primary': '#bba0e4',
        'purple-secondary': '#CEB0FA',
        'gray-light': '#F1F1F1',
        'gray-opacity': '#e6e6e6',
        'gray-secondary': '#E6E0F4',
        'beige-primary': '#EBDCBF',
        'beige-secondary': '#F5E2CEB2',
        'beige-tertiary': '#fbfbfc',
        'calendar-dot': '#FFCACD',
        white: '#fff',
        error: '#FFB0B5',
      },
    },
  },
  plugins: [],
};
