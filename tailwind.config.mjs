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
        'on-surface': '#e2e8f0',
        'on-surface-variant': '#8892b0',
        'on-background': '#e2e8f0',
        'surface-container': '#112240',
        'surface-container-low': '#0d1b2a',
        'surface-container-high': '#1a2f4a',
        'surface-container-highest': '#1e3a5f',
        'surface-container-lowest': '#0a192f',
        'outline-variant': '#1e3a5f',
        'outline': '#334155',
        'surface-dim': '#0a192f',
        'surface-bright': '#1a2f4a',
        'surface': '#0f2640',
        'background': '#0a192f',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
    },
  },
};
