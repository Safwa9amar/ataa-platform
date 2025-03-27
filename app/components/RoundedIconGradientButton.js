import React, { useEffect, useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import Icon from "./Icon";
import Text from "./Text";

import { Platform } from "react-native";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}
const RoundedIconGradientButton = ({
  text,
  iconName,
  iconColor,
  onPress,
  gradientColors,
  gradientStart,
  gradientEnd,
  style,
  slideDirection = "left", // Default slide direction
}) => {
  const slideAnim = useRef(new Animated.Value(slideDirection === "left" ? -200 : 200)).current; // Initial position outside the screen based on direction

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to the original position
      duration: 500, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();
  }, [slideAnim]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
        <LinearGradient
          colors={gradientColors}
          start={gradientStart}
          end={gradientEnd}
          style={[styles.gradientButton, style]}
        >
          <Text color={"white"} type="sm">
            {text}
          </Text>
          <Icon.FontAwesome5
            style={styles.iconStyle(gradientColors[1])}
            name={iconName}
            size={24}
            color={iconColor}
          />
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconStyle: (bg) => ({
    position: "absolute",
    right: -10,
    padding: 15,
    backgroundColor: bg || "#01E441",
    borderRadius: 50,
  }),
});

export default RoundedIconGradientButton;
