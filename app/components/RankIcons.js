import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import silver from "../assets/images/silver.png";
import gold from "../assets/images/gold.png";
import bronze from "../assets/images/bronze.png";
import platinum from "../assets/images/platinum.png";
import Icon from "./Icon";

export default function RankIcons({ rank, size = 30 }) {
  switch (rank) {
    case "Star":
      return (
        <Icon.AntDesign
          name="star"
          size={size}
          color="#f1c40f"
          style={{ marginHorizontal: 5 }}
        />
      );
    case "Silver":
      return <Image style={styles.headerImage(size)} source={silver} />;
    case "Gold":
      return <Image style={styles.headerImage(size)} source={gold} />;
    case "Bronze":
      return <Image style={styles.headerImage(size)} source={bronze} />;
    case "Platinum":
      return <Image style={styles.headerImage(size)} source={platinum} />;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  headerImage: (size) => ({
    width: size,
    height: size,
  }),
});
