import { View, Animated, StyleSheet } from "react-native";
import React, { useEffect, useRef } from "react";

export default function DefaultSkeletonLoader({
  height = 20,
  width = "100%",
  children,
  borderRadius = 4,
}) {
  const pulseAnimation = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.skeleton(borderRadius),
          { height: height, width: width },
          ,
          { opacity: pulseAnimation },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
  },
  skeleton: (borderR) => ({
    borderRadius: borderR,
    backgroundColor: "#aeb5b9",
  }),
});
