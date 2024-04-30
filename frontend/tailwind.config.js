/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors:{
        "ifirma-orange": '#FDAB2E',
        "ifirma-gray": '#E8E8E8',
      },
      fontSize:{
        huge:['2rem', '2.5rem'],
        big:['1.5rem', '2rem'],
        medium:['1.25rem', '1.75rem'],
        small:['1rem', '1.5rem'],
      },
      fontWeight:{
        light: 300,
        normal: 400,
        bold: 700,
      },
    },
  },
  plugins: [],
};


