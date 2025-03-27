import React, { useCallback, useEffect } from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useIsDrawerOpen } from "../context/DrawerContext";
import ModelWrapper from "../components/ModelWrapper";
import { useCart } from "../context/CartContext";
import Text from "../components/Text";
import { useTheme } from "../context/ThemeContext";
import Icon from "../components/Icon";
import { useHideNavbar } from "../context/NavbarVisibilityContext";
import { useDonationModalContext } from "../context/DonationModalContext";
import DonationModal from "../modal/donation";
import { useCredentials } from "../context/CredentialsContext";

export function HeaderLeft() {
  const { showDonationModal, toggleDonationModal, closeDonationModal } =
    useDonationModalContext();
  const { user } = useCredentials();
  const notificationBadge =
    user.notifications?.filter((n) => !n.read).length || 0;

  const { openDrawer } = useIsDrawerOpen();
  const { setHideNavbar } = useHideNavbar();
  const navigation = useNavigation();
  const route = useRoute();
  const donationType = route.params?.typeOfDonation;
  const { cart } = useCart();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openDrawer}>
        <Image
          source={require("../assets/icons/menu.png")}
          style={styles.icon}
          alt="menu"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("CartScreen")}>
        <Image
          source={require("../assets/icons/cart.png")}
          style={styles.icon}
          alt="cart"
        />
        {cart?.length > 0 && (
          <View
            style={[
              styles.cartBadge,
              { backgroundColor: theme.secondaryColorDark },
            ]}
          >
            <Text color="white" type="xs">
              {cart?.length}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          toggleDonationModal();
          navigation.setParams({ typeOfDonation: "fastDonation" });
        }}
      >
        <Image
          source={require("../assets/icons/fastDonation.png")}
          style={styles.icon}
          alt="fastDonation"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Notifications");
          setHideNavbar(true);
        }}
      >
        {notificationBadge > 0 && (
          <View
            style={[
              styles.cartBadge,
              { backgroundColor: theme.secondaryColorDark },
            ]}
          >
            <Text color="white" type="xs">
              {notificationBadge}
            </Text>
          </View>
        )}
        <Icon.MaterialIcons
          name={
            route.name === "Notifications"
              ? "notifications"
              : "notifications-none"
          }
          size={28}
          color={theme.buttonSecondary}
        />
      </TouchableOpacity>
      {donationType === "fastDonation" ||
      donationType === "donateNow" ||
      donationType === "ikfalni" ? (
        <ModelWrapper
          closeModel={closeDonationModal}
          isModelOpen={showDonationModal}
          height="85%"
        >
          <DonationModal />
        </ModelWrapper>
      ) : null}
    </View>
  );
}

export function HeaderRight() {
  const navigation = useNavigation();

  const navigateToHome = useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  return (
    <TouchableOpacity onPress={navigateToHome}>
      <Image
        style={styles.logo}
        source={require("../assets/logo/logoText.png")}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  icon: {
    aspectRatio: 1,
    height: 28,
    width: 28,
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -3,
    borderRadius: 50,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 62,
    height: 30,
  },
});

export default { HeaderLeft, HeaderRight };
