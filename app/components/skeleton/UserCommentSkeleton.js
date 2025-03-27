import React from "react";
import { View, StyleSheet } from "react-native";
import DefaultSkeletonLoader from "./DefaultSkeletonLoader";
import { useTheme } from "../../context/ThemeContext";

const UserCommentSkeleton = () => {
  const {theme} = useTheme()
  return (
    <View style={styles.commentContainer(theme.mangoBlack)}>
      <DefaultSkeletonLoader borderRadius={50} height={40} width={40} />
      <View style={styles.textContainer}>
        <View style={styles.header}>
          <DefaultSkeletonLoader height={12} width={80} />
          <DefaultSkeletonLoader height={12} width={120} />
        </View>
        <DefaultSkeletonLoader height={14} width={200} />
        <DefaultSkeletonLoader height={14} width={200} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: (bg) => ({
    backgroundColor: bg,
    width: "100%",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row-reverse",
    marginVertical: 10,
  }),
  textContainer: {
    flex: 1,
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 5,
  },
});

export default UserCommentSkeleton;
