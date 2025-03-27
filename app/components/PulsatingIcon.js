import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";

const FlashingIcon = ({ children, onPress, loading }) => {
  const { theme } = useTheme();
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const flashAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(borderColorAnim, {
          toValue: 1,
          duration: 500, // Duration for color change to white
          useNativeDriver: false,
        }),
        Animated.timing(borderColorAnim, {
          toValue: 0,
          duration: 500, // Duration for color change back to theme color
          useNativeDriver: false,
        }),
      ])
    );

    flashAnimation.start();

    return () => {
      flashAnimation.stop(); // Clean up the animation on component unmount
    };
  }, [borderColorAnim]);

  // Interpolating border color between two colors
  const interpolatedBorderColor = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.infoColor, "#ffffff"], // Change to any color you want
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          { borderColor: loading ? "" : interpolatedBorderColor },
        ]}
      >
        {loading && (
          <ActivityIndicator
            style={{
              position: "absolute",
              zIndex: 1,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
            }}
            size={70}
            color={theme.textColor}
          />
        )}
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    borderWidth: 2, // Static border width
    borderRadius: 50,
    padding: 10,
    margin: 10,
  },
});

export default FlashingIcon;
