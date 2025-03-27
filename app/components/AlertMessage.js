// src/components/AlertMessage.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const AlertMessage = ({
  message,
  onClose,
  onConfirm,
  isVisible = true,
  type = "info",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-50)).current;
  const { theme } = useTheme();
  const backgroundColor = getBackgroundColor(type, theme);
  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        {
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <View style={styles.buttonContainer}>
        {onClose && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            {Platform.OS === "web" ? (
              <IoMdClose fill={theme.white} />
            ) : (
              <Icon.MaterialIcons name="close" size={24} color={theme.white} />
            )}
          </TouchableOpacity>
        )}
        {onConfirm && (
          <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
            {Platform.OS === "web" ? (
              <FaCheck fill={theme.white}/>
            ) : (
              <Icon.MaterialIcons name="check" size={24} color={theme.white} />
            )}
          </TouchableOpacity>
        )}
      </View>
      <Text style={[styles.message, { color: theme.white }]}>{message}</Text>
    </Animated.View>
  );
};

const getBackgroundColor = (type, theme) => {
  switch (type) {
    case "success":
      return theme.successColor;
    case "error":
      return theme.errorColor;
    case "warning":
      return theme.warningColor;
    default:
      return theme.infoColor;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
  },
  message: {
    flex: 1,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confirmButton: {
    padding: 5,
    marginRight: 10,
  },
  closeButton: {
    padding: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default AlertMessage;
