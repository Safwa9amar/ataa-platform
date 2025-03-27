// ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "../utils/theme";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false);
  const [preferredTheme, setPreferredTheme] = useState("system");
  const toggleTheme = () => {
    AsyncStorage.setItem("isDarkMode", (!isDarkMode).toString());
    setDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    theme: isDarkMode ? darkTheme : lightTheme,
    toggleTheme,
  };

  useEffect(() => {
    AsyncStorage.getItem("isDarkMode").then((value) => {
      if (value !== null) {
        setDarkMode(value === "true");
        setPreferredTheme("user");
      }
    });

    const handleColorSchemeChange = ({ colorScheme }) => {
      if (preferredTheme === "system") {
        setDarkMode(colorScheme === "dark");
      }
    };
    Appearance.addChangeListener(handleColorSchemeChange);

    return () => {
      Appearance.removeChangeListener(handleColorSchemeChange);
    };
  }, []);
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
