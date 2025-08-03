module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coralblush: '#F26A8D', // Primary
        lilac: '#CDB4DB',      // Secondary
        champagne: '#F6E7D7',  // Accent
        charcoal: '#2E2E2E',   // Dark
        mint: '#EDFDF6',       // Highlight
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 