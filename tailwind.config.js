/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        shama: {
          clay: "#F5EBE8",
          blue: "#3596D5",
          terra: "#BD7563",
          green: "#0F7F40",
          black: "#000000",
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // ✅ Add this line
  ],
};
