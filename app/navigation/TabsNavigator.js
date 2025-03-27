import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { useNavigation, useScrollToTop } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useIsDrawerOpen } from "../context/DrawerContext";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import ReactNativeHapticFeedback from "react-native-haptic-feedback"; // Import haptic feedback library
import Animated, {
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function TabsNavigator() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { hideNavbar } = useHideNavbar();
  const { isDrawerOpen } = useIsDrawerOpen();
  const bottom = useSharedValue(100);

  useEffect(() => {
    bottom.value = withTiming(hideNavbar ? 100 : 0);
  }, [hideNavbar, isDrawerOpen]);

  const [currentRoute, setCurrentRoute] = useState("Home");

  const routes = [
    {
      name: "Home",
      icon: require("../assets/icons/homeActive.png"),
      iconInactive: require("../assets/icons/homeInactive.png"),
    },
    {
      name: "DonationScreen",
      icon: require("../assets/icons/donationActive.png"),
      iconInactive: require("../assets/icons/donationInactive.png"),
    },
    {
      name: "StoreScreen",
      icon: require("../assets/icons/StoreActive.png"),
      iconInactive: require("../assets/icons/StoreInactive.png"),
    },
    {
      name: "ProgramsScreen",
      icon: require("../assets/icons/programeActive.png"),
      iconInactive: require("../assets/icons/programeInactive.png"),
    },
  ];

  const handlePress = (index) => {
    let screen = routes[index].name;
    if (screen === currentRoute) return;

    // Trigger haptic feedback
    ReactNativeHapticFeedback.trigger("impactLight", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });

    navigation.navigate(screen);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      setCurrentRoute(e.data.state?.routes[e.data.state.index].name || "Home");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Animated.View
      style={{
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
        transform: [{ translateY: bottom }],
      }}
    >
      {routes.map((route, index) => (
        <TouchableOpacity
          key={route.name}
          style={[
            {
              shadowColor: "#000",
              shadowOffset: { width: 10, height: 2 },
              shadowOpacity: route.name === currentRoute ? 0.25 : 0,
              elevation: route.name === currentRoute ? 10 : 0,
              marginBottom: route.name === currentRoute ? 30 : 0,
              padding: 10,
              borderRadius: 50,
              backgroundColor:
                route.name === currentRoute ? theme.buttonPrimary : theme.navBg,
            },
          ]}
          onPress={() => handlePress(index)}
        >
          <Image
            source={
              route.name === currentRoute ? route.icon : route.iconInactive
            }
            style={{ width: 24, height: 30, aspectRatio: 1 }}
            alt={route.name}
          />
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}
