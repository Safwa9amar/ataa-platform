import React from "react";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useTheme } from "../context/ThemeContext";

const SwipableItem = ({
  children,
  onDelete,
  leftActions,
  rightActions,
  key,
}) => {
  const { theme } = useTheme();

  const renderLeftActions = (progress, dragX) => {
    if (!leftActions) return null;

    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.leftAction}>
        <Animated.View
          style={[styles.actionContainer, { transform: [{ scale }] }]}
        >
          {leftActions}
        </Animated.View>
      </View>
    );
  };

  const renderRightActions = (progress, dragX) => {
    if (!rightActions) return null;

    const scale = dragX.interpolate({
      inputRange: [-10, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.rightAction(theme.mangoBlack)}>
        <Animated.View
          style={[styles.actionContainer, { transform: [{ scale }] }]}
        >
          {rightActions}
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        key={key}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => direction === "right" && onDelete()}
      >
        <View style={styles.itemContainer}>{children}</View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    marginHorizontal: 10,
  },
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  leftAction: {
    // backgroundColor: '#4CAF50',
    justifyContent: "center",
    borderRadius: 5,
  },
  rightAction: (bg) => ({
    backgroundColor: bg || "#F44336",
    justifyContent: "center",
    borderRadius: 5,
  }),
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default SwipableItem;
