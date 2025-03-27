import { View, Text } from "react-native";
import React from "react";

export default function DrawerNavigator() {
  return (
    <View
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#00000055",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 120,
      }}
    >
      <Text>DrawerNavigator </Text>
    </View>
  );
}
