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
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
};
