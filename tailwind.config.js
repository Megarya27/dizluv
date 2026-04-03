/** @type {import('tailwindcss').Config} */
module.exports = {
  // Update this to include the paths to all of your component files
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FE3C72", // Dizluv signature pink
        secondary: "#FF6B6B",
        accent: "#4DABF7",
        background: "#0F172A",
        surface: "#1E293B",
      },
      fontFamily: {
        // We can add custom fonts here if needed
      }
    },
  },
  plugins: [],
}
