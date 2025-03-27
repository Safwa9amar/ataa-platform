import React from "react";
import { View, StyleSheet } from "react-native";
import DefaultSkeletonLoader from "./DefaultSkeletonLoader";

const RenderTableItemSkeleton = () => {
  return (
    <View style={styles.tableRow}>
      {/* Skeleton for RankIcons */}
      <DefaultSkeletonLoader width={40} height={40} borderRadius={20} />
      
      {/* Skeleton for totalDonationAmount */}
      <DefaultSkeletonLoader width={100} height={20} borderRadius={4} />
      
      {/* Skeleton for donor */}
      <DefaultSkeletonLoader width={150} height={20} borderRadius={4} />
    </View>
  );
};

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0", // Or use theme colors
  },
});

export default RenderTableItemSkeleton;
