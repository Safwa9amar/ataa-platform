import React from "react";
import { View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Text from "../Text";

const Stripe = () => {
  const { theme } = useTheme();

  return (
    <View style={{ gap: 20, alignItems: "center" }}>
      <Text type="md" style={{ color: theme.textColor }}>
        قيد التطوير
      </Text>
    </View>
  );
};

export default Stripe;
