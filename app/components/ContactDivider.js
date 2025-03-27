import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Text from "./Text";

const ContactDivider = ({
  label,
  vertical = false,
  textSize = "md",
  children,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container(vertical)}>
      <View
        style={[styles.divider(vertical), { backgroundColor: theme.textColor }]}
      />
      {children
        ? children
        : label && (
            <Text type={textSize} style={styles.label(vertical)}>
              {label}
            </Text>
          )}
      <View
        style={[styles.divider(vertical), { backgroundColor: theme.textColor }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: (vertical) => ({
    flexDirection: vertical ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  }),
  divider: (vertical) => ({
    flexGrow: 1,
    width: vertical ? 1 : 20,
    height: vertical ? 50 : 1,
  }),
  label: (vertical) => ({
    marginHorizontal: vertical ? 0 : 20,
    marginVertical: vertical ? 20 : 0,
    textAlign: "center",
    // rotate text 90 degrees
    transform: vertical ? [{ rotate: "90deg" }] : [],
  }),
});

export default ContactDivider;
