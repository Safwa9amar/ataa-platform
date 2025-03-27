import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";

const FileDisplay = ({ filename, mimetype }) => {
  if (!filename) return null;
  const { theme } = useTheme();
  const {borderColor, mangoBlack} = theme

  // Map MIME types to icons
  const getIconByMimeType = (mimetype) => {
    switch (true) {
      case mimetype.startsWith("image/"):
        return <Icon name="file-image-o" size={30} color="#3b82f6" />; // Blue
      case mimetype === "application/pdf":
        return <Icon.FontAwesome name="file-pdf-o" size={30} color="#ef4444" />; // Red
      case mimetype === "application/msword" ||
        mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return (
          <Icon.FontAwesome name="file-word-o" size={30} color="#1d4ed8" />
        ); // Blue
      case mimetype === "application/vnd.ms-excel" ||
        mimetype ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return (
          <Icon.FontAwesome name="file-excel-o" size={30} color="#22c55e" />
        ); // Green
      case mimetype.startsWith("application/zip") ||
        mimetype === "application/x-rar-compressed":
        return (
          <Icon.FontAwesome name="file-archive-o" size={30} color="#eab308" />
        ); // Yellow
      default:
        return <Icon.FontAwesome name="file-o" size={30} color="#6b7280" />; // Gray
    }
  };

  return (
    <View style={styles.container(borderColor, mangoBlack)}>
      {/* Icon based on MIME type */}
      <View style={styles.iconContainer}>{getIconByMimeType(mimetype)}</View>
      {/* Filename */}
      <Text style={styles.filename} numberOfLines={1}>
        {filename}
      </Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: (borderColor, backgroundColor) => ({
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: borderColor, // Light gray border
    borderRadius: 8,
    backgroundColor: backgroundColor, // Dark background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  }),
  iconContainer: {
    marginRight: 16,
  },
  filename: {
    fontSize: 18,
    color: "#f3f4f6", // Light text color
    flex: 1,
  },
});

export default FileDisplay;
