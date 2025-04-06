/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF66B2", // Rose Bahamut
        primary_hover: "#FF3399", // Rose Bahamut plus foncé
        secondary: "#FFE6F2", // Rose très clair
        accent: "#FFC0D9", // Rose moyen
        light_bg: "#FFFFFF", // Fond clair
        light_text: "#333333", // Texte foncé pour fond clair
        purple_100: "#EDEBFE",
        purple_800: "#5521B5",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
