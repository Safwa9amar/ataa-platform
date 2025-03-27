import React from "react";
import { View, StyleSheet } from "react-native";
import DefaultSkeletonLoader from "./DefaultSkeletonLoader";

const CharityCardSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <DefaultSkeletonLoader height={250} width="100%" />
      {/* Skeleton for image */}
      <View style={styles.textContainer}>
        <DefaultSkeletonLoader height={20} width="70%" />
        {/* Skeleton for name */}
        <DefaultSkeletonLoader height={20} width="90%" />
        {/* Skeleton for description */}
        <DefaultSkeletonLoader height={20} width="50%" />
        {/* Skeleton for country */}
      </View>
      <View style={styles.iconContainer}>
        <DefaultSkeletonLoader height={20} width={40} />
        {/* Skeleton for shareCount */}
        <DefaultSkeletonLoader height={20} width={40} />
        {/* Skeleton for commentCount */}
        <DefaultSkeletonLoader height={20} width={40} />
        {/* Skeleton for likeCount */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    height: 450,
    width: "100%",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Light gray background for skeleton
  },
  textContainer: {
    alignSelf: "flex-end",
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "lightgrey",
    paddingTop: 20,
  },
});

export default CharityCardSkeleton;
