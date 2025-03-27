import { View, Text } from "react-native";
import React from "react";
import { HeaderLeft, HeaderRight } from "./Header";

export default function CustomHeader({ style }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        width: "100%",
        ...style,
      }}
    >
      <HeaderLeft />
      <HeaderRight />
    </View>
  );
}
