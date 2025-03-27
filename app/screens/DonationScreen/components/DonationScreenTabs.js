import React, { useState, useCallback, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import Text from "../../../components/Text";
import ProjectsSvg from "../../../assets/vectors/ProjectsSvg";
import TayasrtSvg from "../../../assets/vectors/TayasrtSvg";
import ForejatSvg from "../../../assets/vectors/ForejatSvg";
import IghathaSvg from "../../../assets/vectors/IghathaSvg";

const DonationScreenTabs = ({ setCurrentScreen }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("مشاريع");

  const handleTabPress = (tabName, screen) => {
    setActiveTab(tabName);
    setCurrentScreen(screen);
  };

  const getTabStyle = (isActive) => ({
    backgroundColor: isActive ? theme.buttonPrimary : theme.mangoBlack,
  });

  const tabData = [
    {
      screen: "Projects",
      name: "مشاريع",
      IconComponent: ProjectsSvg,
    },
    {
      screen: "Tayasart",
      name: "تيسيرت",
      IconComponent: TayasrtSvg,
    },
    {
      screen: "Forejat",
      name: "فرجت",
      IconComponent: ForejatSvg,
    },
    {
      screen: "Eghatha",
      name: "إغاثة",
      IconComponent: IghathaSvg,
    },
  ];

  return (
    <View style={styles.tabsContainer}>
      {tabData.map(({ screen, name, IconComponent }) => {
        const isActive = activeTab === name;
        return (
          <TabItem
            key={name}
            label={name}
            icon={
              <IconComponent
                height="60"
                width="60"
                active={isActive}
                style={[styles.tabItem, getTabStyle(isActive)]}
              />
            }
            onPress={() => handleTabPress(name, screen)}
          />
        );
      })}
    </View>
  );
};

const TabItem = ({ onPress, label, icon }) => (
  <Pressable onPress={onPress} style={styles.tabPressable}>
    {icon}
    <Text type="sm">{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  tabsContainer: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-evenly",
  },
  tabItem: {
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  tabPressable: {
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
});

export default DonationScreenTabs;
