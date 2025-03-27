"use client";
import React from "react";
import { Button } from "@material-tailwind/react";
import { useTheme } from "@/context/ThemeContext";

/**
 * ToggleButtonGroup component for rendering a group of toggle buttons.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.options - The options for the toggle buttons.
 * @param {string} props.options.label - The label for the button group.
 * @param {Array} props.options.choices - An array of button choices.
 * @param {string} props.options.choices[].label - The label for each button.
 * @param {string} props.options.choices[].value - The value of each button.
 * @param {React.ElementType} props.options.choices[].icon - The icon component for each button.
 * @param {string} props.selectedOption - The currently selected button value.
 * @param {Function} props.setSelectedOption - Function to update the selected option.
 * @param {Object} props.theme - Theme object to define colors.
 * @param {Function} props.getButtonStyles - Function to get button styles based on selection.
 *
 * @returns {JSX.Element} Rendered ToggleButtonGroup component.
 */
const ToggleButtonGroup = ({
  options,
  selectedOption,
  setSelectedOption,
  getButtonStyles,
  error,
}) => {
  const { theme } = useTheme();
  return (
    <div className={`${error ? "border border-red-500 rounded-md" : ""} p-5`}>
      <label className="text-textColor font-ElMessiri">{options.label}</label>
      <div className="flex flex-wrap gap-2">
        {options.choices.map((option) => (
          <Button
            key={option.value}
            {...getButtonStyles(selectedOption === option.value)}
            onClick={() => setSelectedOption(option.value)}
          >
            <p>{option.label}</p>
            {option.icon &&
              React.createElement(option.icon, {
                size: 20,
                color:
                  selectedOption === option.value ? "white" : theme.textColor,
              })}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ToggleButtonGroup;
