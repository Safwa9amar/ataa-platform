"use client";
import { useTheme } from "@/context/ThemeContext";
import React from "react";

export default function PageContainer({ children }) {
  const { isDarkMode, theme } = useTheme();
  return (
    <div
      data-theme={isDarkMode ? "dark" : "white"}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
      }}
    >
      {children}
    </div>
  );
}
