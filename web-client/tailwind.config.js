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
        // Background and Foreground Colors
        nav_bg: "var(--navBg)",
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

        // HSL Color Functions
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      backgroundImage: {
        // Background images for sections
        charityBg: "url(/images/charities.jpg)",
        aboutUsBg: "url(https://enthuse.com/wp-content/uploads/2020/05/destination-1285851.png)",
        spinnerBG: "url(/logo/logoWithCircle.png)",
        homeSuperVisorAuth: "url(/images/charityday.jpg)",
        bloodTypeHolder: "url(/images/bloodTypeHolder.png)",
        paymentBG: "url(/images/paymentBG.jpg)",
      },
    },
    fontFamily: {
      ElMessiri: ["var(--font-ElMessiri)"],
      ReemKufi: ["var(--font-ReemKufi)"],
      sans: ["var(--font-ElMessiri)"], // Default sans-serif font family
    },
  },
  plugins: [
    // Add any custom plugins if needed
  ],
});
