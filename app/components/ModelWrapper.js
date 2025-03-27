import React, { useRef } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Animated,
  PanResponder,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

// TODO : fix scroll behavior in the model
const ModelWrapper = ({
  children,
  isModelOpen,
  closeModel,
  height = "75%",
}) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 150) {
          Animated.timing(translateY, {
            toValue: 1000, // Move it off-screen
            duration: 100,
            useNativeDriver: true,
          }).start(() => {
            closeModel();
            translateY.setValue(0); // Reset the value after closing
          });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent
      visible={isModelOpen}
      onRequestClose={closeModel}
    >
      <View style={styles.centeredView}>
        <Pressable onPress={closeModel} style={styles.overlay} />
        <View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <Animated.View
          style={[
            styles.modalView,
            {
              overflow: "hidden",
              height: height,
              backgroundColor: theme.mangoBlack,
              transform: [{ translateY }],
            },
          ]}
        >
          <View
            {...panResponder.panHandlers}
            onPress={closeModel}
            style={[styles.handle, { backgroundColor: theme.borderColor }]}
          />
          <View
            pointerEvents="box-none"
            style={{ flex: 1,  width: "100%" }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "100%",
  },
  modalView: {
    width: "100%",
    padding: 20,
    alignItems: "center",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  handle: {
    width: 150,
    height: 10,
    borderRadius: 5,
    margin: 10,
    position: "absolute",
    top: 20,
    transform: [{ translateY: -15 }],
  },
});

export default ModelWrapper;
