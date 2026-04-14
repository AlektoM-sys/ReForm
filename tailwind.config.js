module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        sans: ["Montserrat", "Inter", "sans-serif"],
      },
      colors: {
        gold: "#d4af37",
        ivory: "#f5e9c6",
        anthracite: "#121212",
        emerald: "#1edc8b",
      },
      boxShadow: {
        'neon': '0 0 16px 2px #1edc8b99',
      },
    },
  },
  plugins: [],
};
