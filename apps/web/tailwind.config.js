/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#745a27',
        'primary-container': '#c9a96e',
        'on-primary': '#ffffff',
        'on-primary-container': '#543d0c',
        surface: '#fcf9f8',
        'surface-dim': '#dcd9d9',
        'surface-bright': '#fcf9f8',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f6f3f2',
        'surface-container': '#f0eded',
        'surface-container-high': '#eae7e7',
        'surface-container-highest': '#e4e2e1',
        'on-surface': '#1b1c1c',
        'on-surface-variant': '#4d463a',
        'inverse-surface': '#303030',
        'inverse-on-surface': '#f3f0f0',
        outline: '#7f7668',
        'outline-variant': '#d0c5b5',
        'surface-tint': '#745a27',
        secondary: '#5f5e5e',
        'on-secondary': '#ffffff',
        'secondary-container': '#e2dfde',
        tertiary: '#605e5a',
        'tertiary-container': '#b1ada9',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        background: '#fcf9f8',
        'on-background': '#1b1c1c'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif']
      },
      maxWidth: {
        'container': '1280px'
      }
    },
  },
  plugins: [],
};
