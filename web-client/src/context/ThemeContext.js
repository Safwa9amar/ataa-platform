import React, { createContext, useContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "../config/theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false);
  const [preferredTheme, setPreferredTheme] = useState("system");

  const toggleTheme = () => {
    localStorage.setItem("isDarkMode", (!isDarkMode).toString());
    setDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    theme: isDarkMode ? darkTheme : lightTheme,
    toggleTheme,
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("isDarkMode");
    if (storedTheme !== null) {
      setDarkMode(storedTheme === "true");
      setPreferredTheme("user");
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(systemPrefersDark);
    }

    const handleColorSchemeChange = (e) => {
      if (preferredTheme === "system") {
        setDarkMode(e.matches);
      }
    };

    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    darkModeMediaQuery.addEventListener("change", handleColorSchemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleColorSchemeChange);
    };
  }, [preferredTheme]);

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
