import { StyleSheet } from "react-native";

// Common Styles
const commonStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    alignItems: "center",
  },
});

// Common Colors
const commonColors = {
  errorColor: "#E57373",
  successColor: "#81C784",
  warningColor: "#FFB74D",
  infoColor: "#64B5F6",
  white: "#FFFFFF",
  black: "#000000",
  placeholderTextColor: "#A9A9A9",
  BONKER_PINK: "#FF6B6B",
  CARROT: "#FF6D40",
};

// Light Theme
export const lightTheme = {
  fontFamily: "ElMessiri",
  commonStyles,
  // Colors
  // primaryColor: "#007ACC", // Dark Blue
  primaryColor: "#007AFF",

  secondaryColor: "#388E3C", // Dark Green
  backgroundColor: "#F3F3F3",
  textColor: "#000000",
  secondaryTextColor: "#757575",
  steel: "#B0BEC5",
  ruptur_blue: "#A9D7DD",
  borderColor: "#E0E0E0",
  mangoBlack: "#FFFFFF",
  buttonPrimary: "#00BCD4", // Dark Blue
  buttonSecondary: "#2ecc71", // Dark Green
  // Modifiers
  primaryColorLight: "#7fb3d5",
  primaryColorDark: "#2674ab",
  secondaryColorLight: "#8eeb8e",
  secondaryColorDark: "#1a991a",
  // Navigation
  navBg: "#F5F5F5EE",
  ...commonColors,
};

// Dark Theme
export const darkTheme = {
  fontFamily: "ElMessiri",
  commonStyles,
  // Colors
  primaryColor: "#ADD8E6", // Light Blue
  secondaryColor: "#A8E6CF", // Light Green
  backgroundColor: "#2C3333",
  textColor: "#E0E0E0",
  secondaryTextColor: "#B0BEC5",
  steel: "#CFD8DC",
  ruptur_blue: "#8C9EFF",
  borderColor: "#373737",
  mangoBlack: "#2A2C38",
  buttonPrimary: "#ADD8E6", // Light Blue
  buttonSecondary: "#A8E6CF", // Light Green
  // Modifiers
  primaryColorLight: "#D1EFFF",
  primaryColorDark: "#007ACC",
  secondaryColorLight: "#DFF5E1",
  secondaryColorDark: "#388E3C",
  // Shadows
  boxShadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  // Navigation
  navBg: "#2E4F4F",
  ...commonColors,
};
