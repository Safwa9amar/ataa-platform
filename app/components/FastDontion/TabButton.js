import React from "react";
import {  StyleSheet, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Text from "../Text";
import { useTheme } from "../../context/ThemeContext";

const TabButton = ({ tab, activeTab, setActiveTab, label }) => {
  const { theme } = useTheme();
  const tabImages = {
    Baridi: require("../../assets/images/ccp.jpg"),
    BaridiMob: require("../../assets/images/baridiMob.png"),
    Cash: require("../../assets/images/eldahabia.jpg"),
    Stripe: require("../../assets/images/wp-stripe-donation.png"),
  };

  return (
    <TouchableOpacity
      onPress={() => setActiveTab(tab)}
      style={styles.tabButton(activeTab === tab, theme)}
    >
      {tabImages[tab] && (
        <Image style={styles.tabImage} source={tabImages[tab]} />
      )}
      {tab && !label && (
        <Text type="sm">
          {tab === "Baridi"
            ? "بريد الجزائر"
            : tab === "BaridiMob"
            ? "بريدي موب"
            : tab === "Cash"
            ? "الذهبية"
            : tab === "Stripe"
            ? "Stripe"
            : tab}
        </Text>
      )}
      {label && <Text type="sm">{label}</Text>}
    </TouchableOpacity>
  );
};

TabButton.propTypes = {
  tab: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  tabButton: (isActive, theme) => ({
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
    backgroundColor: isActive ? "#DFF5E1" : theme.borderColor,
    padding: 10,
    borderRadius: 5,
  }),
  tabImage: {
    height: 30,
    width: 40,
  },
});

export default TabButton;
