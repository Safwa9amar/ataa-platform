import React from "react";
import { View, Pressable, ScrollView, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext"; // Assuming you have a theme hook
import Icon from "./Icon";
import Text from "./Text";

const LabelContainer = ({ label, textSize, children, width = "100%" }) => {
  return (
    <View style={{ width: width, }}>
      <Text type={textSize ? textSize : "md"} style={{ alignSelf: "flex-end" }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "flex-end",
          margin: 10,
        }}
      >
        {children}
      </View>
    </View>
  );
};

export const Button = ({
  isActive,
  label,
  onPress,
  icon,
  props,
  bgColor,
  rowReversed,
  width = 50,
  height = "auto",
}) => {
  const { theme } = useTheme();

  const buttonContainerStyle = {
    flexDirection: rowReversed ? "row-reverse" : "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 5,
    paddingHorizontal: 20,
    minWidth: width,
    height: height,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: bgColor
      ? bgColor
      : isActive
      ? theme.buttonPrimary
      : theme.borderColor,
    backgroundColor: bgColor
      ? bgColor
      : isActive
      ? theme.buttonPrimary
      : "transparent",
  };
  return (
    <TouchableOpacity {...props} style={buttonContainerStyle} onPress={onPress}>
      <Text
        style={{ color: isActive ? theme.white : theme.textColor }}
        type={icon ? "sm" : "md"}
      >
        {label}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};

export default LabelContainer;
