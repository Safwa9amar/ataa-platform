import React, { useEffect, useState } from "react";
import { View, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAppContext } from "../context/AppContext";
import Text from "./Text";

export default function AppLoader() {
  const { theme } = useTheme();
  const { appIsReady, loading } = useAppContext();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("../assets/logo/fullLogo.png")}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color={theme.primaryColor}
          style={styles.indicator}
        />
      )}
      {(!loading && !appIsReady) && (
        <Text type="md" color={theme.errorColor}>
          الخدمة غير متوفرة حالياً، يرجى المحاولة لاحقاً
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1000,
  },
  logo: {
    width: 250,
    height: 180,
    marginTop: -50,
  },
  indicator: {
    marginTop: 20,
  },
});
