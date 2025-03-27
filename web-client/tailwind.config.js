/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],

  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nav_bg: "var(--navBg)",
        // Map your commonColors and theme colors here
        errorColor: "var(--errorColor)",
        successColor: "var(--successColor)",
        warningColor: "var(--warningColor)",
        infoColor: "var(--infoColor)",

        placeholderTextColor: "var(--placeholderTextColor)",
        BONKER_PINK: "var(--BONKER_PINK)",
        CARROT: "var(--CARROT)",

        // Light Theme Colors
        primaryColor: "var(--primaryColor)",
        secondaryColor: "var(--secondaryColor)",
        backgroundColor: "var(--backgroundColor)",
        textColor: "var(--textColor)",
        secondaryTextColor: "var(--secondaryTextColor)",
        steel: "var(--steel)",
        ruptur_blue: "var(--ruptur_blue)",
        borderColor: "var(--borderColor)",
        mangoBlack: "var(--mangoBlack)",
        buttonPrimary: "var(--buttonPrimary)",
        buttonSecondary: "var(--buttonSecondary)",
        primaryColorLight: "var(--primaryColorLight)",
        primaryColorDark: "var(--primaryColorDark)",
        secondaryColorLight: "var(--secondaryColorLight)",
        secondaryColorDark: "var(--secondaryColorDark)",
      },
      backgroundImage: {
        charityBg: "url(/images/charities.jpg)",
        aboutUsBg:
          "url(https://enthuse.com/wp-content/uploads/2020/05/destination-1285851.png)",
        spinnerBG: "url(/logo/logoWithCircle.png)",
        homeSuperVisorAuth: "url(/images/charityday.jpg)",
        bloodTypeHolder: "url(/images/bloodTypeHolder.png)",
        paymentBG: "url(/images/paymentBG.jpg)",
      },
    },
    fontFamily: {
      ElMessiri: ["var(--font-ElMessiri)"],
      ReemKufi: ["var(--font-ReemKufi)"],
      sans: ["var(--font-ElMessiri)"], // Set your default fonts
    },
  },
  plugins: [],
});
