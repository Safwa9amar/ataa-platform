import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import * as Progress from "react-native-progress";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";

let types = {};
Platform.OS === "web"
  ? (types = { images: "image", videos: "video", files: "file" })
  : (types = {
      images: "public.image",
      videos: "public.movie",
      files: "public.data",
    });

const UploadFileProgress = ({ fileName, type, uri, progress, icon }) => {
  const { theme } = useTheme();

  console.log("type", type, types.images);

  return (
    <View style={[styles.container, { backgroundColor: theme.mangoBlack }]}>
      <View style={styles.header}>
        <Text style={styles.fileName(theme.textColor)}>{fileName}</Text>
        {type === types.images ? (
          <Image source={{ uri: uri }} style={styles.img} />
        ) : (
          <Icon name={icon} size={30} color={theme.primaryColor} />
        )}
      </View>
      <Icon
        style={styles.checkIcon}
        name={progress === 1 ? "check-circle" : "error"}
        size={18}
        color={progress === 1 ? "green" : theme.errorColor}
      />
      <Progress.Bar
        color="green"
        animated={true}
        progress={progress}
        width={300}
        height={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 10,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    width: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginHorizontal: 10,
  },
  fileName: (color) => ({
    fontSize: 12,
    maxWidth: 200,
    textAlign: "right",
    color: color,
  }),
  checkIcon: {
    position: "absolute",
    top: 15,
    left: 15,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
});

export default UploadFileProgress;
