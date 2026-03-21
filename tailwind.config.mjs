/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0a192f',
        accent: '#64ffda',
        'card-dark': '#112240',
        'text-muted': '#8892b0',
        'background-dark': '#0a192f',
        'background-light': '#f6f7f8',
        'on-primary': '#0a192f',
        'on-surface': '#ccd6f6',
        'on-surface-variant': '#8892b0',
        'on-background': '#ccd6f6',
        'surface-container': '#112240',
        'surface-container-low': '#0d1b2a',
        'surface-container-high': '#1d2d50',
        'surface-container-highest': '#233554',
        'surface-container-lowest': '#020c1b',
        'outline-variant': '#495670',
        'outline': '#233554',
        'surface-dim': '#081221',
        'surface-bright': '#112240',
        'surface': '#0a192f',
        'background': '#0a192f',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
};
