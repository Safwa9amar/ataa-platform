"use client";
import React, { useState, useEffect } from "react";
import { IoMdSunny } from "react-icons/io"; // Import the light mode icon
import { useTheme } from "@/context/ThemeContext";
import { IconButton } from "@material-tailwind/react";
import { RiMoonClearLine } from "react-icons/ri";

const DarkLightToggle = ({ isScrolled, isHomePage }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  const handleToggle = () => {
    setAnimate(true);
    toggleTheme();
    setTimeout(() => setAnimate(false), 300); // Duration of the animation
  };

  return (
    <IconButton
      variant="text"
      className="px-0 m-0 relative "
      onClick={handleToggle}
      aria-label="Toggle dark mode"
    >
      <div
        className={`transition-transform duration-300 ${
          animate ? "rotate-180 scale-125" : "rotate-0 scale-100"
        }`}
      >
        {isDarkMode ? (
          <IoMdSunny
            className={
              isHomePage && !isScrolled ? "text-white " : "text-teal-700"
            }
            size={28}
          /> // Light mode icon
        ) : (
          <RiMoonClearLine
            className={
              isHomePage && !isScrolled ? "text-white " : "text-teal-700"
            }
            size={28}
          /> // Dark mode icon
        )}
      </div>
    </IconButton>
  );
};

export default DarkLightToggle;
