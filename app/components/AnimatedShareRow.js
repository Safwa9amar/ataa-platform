import React, { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons"; // Adjust the import based on your Icon setup
import { useTheme } from "../context/ThemeContext";

const AnimatedShareRow = ({ shareDonationOpportunity, data }) => {
  const { theme } = useTheme();
  //   const { show, hide } = useAnimatedShareRowContext();

  // Shared value for animation
  const translateX = useSharedValue(-50); // Start from off-screen left

  // Animation to move icons into view
  useEffect(() => {
    translateX.value = withTiming(0, { duration: 1000 }); // Animate to center
  }, []);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Icons and their corresponding social media names
  const icons = [
    { name: "logo-facebook", platform: "facebook" },
    // { name: "logo-instagram", platform: "instagram" }, // Uncomment if needed
    { name: "logo-whatsapp", platform: "whatsapp" },
    { name: "logo-twitter", platform: "twitter" },
    { name: "logo-linkedin", platform: "linkedin" },
  ];

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: 12,
          width: "90%",
          borderRadius: 20,
          backgroundColor: theme.navBg,
          height: 50,
          justifyContent: "space-evenly",
          alignItems: "center",
          alignSelf: "center",
          flexDirection: "row",
        },
        animatedStyle,
      ]}
    >
      {icons.map((icon) => (
        <TouchableOpacity
          key={icon.platform}
          onPress={() =>
            shareDonationOpportunity(data.id, data.title, icon.platform)
          }
          style={styles.iconButton}
        >
          <Icon name={icon.name} size={24} color={theme.steel} />
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

const styles = {
  iconRow: {
    backgroundColor: "white",
    borderRadius: 10,
    flexDirection: "row",
    padding: 10,
    position: "absolute",
    zIndex: 1111,
    alignSelf: "center",
    bottom: 0,
  },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "transparent",
  },
};

export default AnimatedShareRow;
