import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from "./Text";

import { Platform } from "react-native";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}
export default function PrimaryBtn({
  onPress,
  title,
  colors = ["#22C6CB", "#01E441"],
  ...props
}) {
  return (
    <TouchableOpacity
      {...props}
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.buttonContainer}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.buttonContainer}
      >
        <Text type="md" style={styles.buttonText}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    minWidth: 250,
    padding: 5,
    height: 40,
    borderRadius: 30,
    marginVertical: 10,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});
