import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ScreensContainer({ children, style, ...props }) {
  const { theme } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.backgroundColor }, // Example: use theme properties if needed
        style, // Merge with the additional style prop
      ]}
      {...props} // Spread the remaining props onto the ScrollView
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    // padding: 10, // Uncomment or modify if padding is needed
  },
});
