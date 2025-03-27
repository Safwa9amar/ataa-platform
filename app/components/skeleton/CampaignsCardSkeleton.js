import React from "react";
import { View, StyleSheet } from "react-native";
import DefaultSkeletonLoader from "./DefaultSkeletonLoader";
import { useTheme } from "../../context/ThemeContext";

const CampaignsCardSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { borderColor: theme.borderColor, backgroundColor: theme.mangoBlack },
      ]}
    >
      {/* Skeleton for Image */}
      <DefaultSkeletonLoader width={70} height={70} style={styles.image} />

      <View style={[styles.textContainer]}>
        <View style={styles.row}>
          {/* Skeleton for Label */}
          <DefaultSkeletonLoader width={100} height={20} />

          {/* Skeleton for Icon */}
          <DefaultSkeletonLoader width={20} height={20} style={styles.icon} />
        </View>

        {/* Skeleton for Description */}
        <DefaultSkeletonLoader width={150} height={15} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 20,
    paddingVertical: 10,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    marginLeft: 10,
  },
});

export default CampaignsCardSkeleton;
