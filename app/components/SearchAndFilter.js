import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import SearchBar from "./SearchBar";
import Icon from "./Icon";
import Collapsible from "react-native-collapsible";
import TabItem from "./TabItem";
import HorizentalSvg from "../assets/vectors/HorizentalSvg";
import VerticalSvg from "../assets/vectors/VerticalSvg";
import { useTheme } from "../context/ThemeContext";

export const SearchAndFilter = ({
  setProgress,
  setIsHorizontal,
  isHorizontal,
  handleSearch,
  ShowFilterModal,
  withFilter,
  currentTab,
  disableDots = false,
}) => {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTabActive, setIsTabActive] = useState(false);
  const [horizontal, setHorizontal] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const handleChangeDirection = (bool) => {
    setIsHorizontal(bool);
    setHorizontal(bool);
    if (horizontal) {
      ToastAndroid.show("تم تغيير العرض الى عرض عمودي", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("تم تغيير العرض الى عرض افقي", ToastAndroid.SHORT);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <SearchBar
          fetchDataCallback={handleSearch}
          width={withFilter && currentTab ? "70%" : "90%"}
        />
        {!disableDots && (
          <TouchableOpacity onPress={toggleCollapse}>
            <Icon.Entypo
              name="dots-three-vertical"
              size={24}
              color={theme.steel}
            />
          </TouchableOpacity>
        )}
        {withFilter && currentTab !== "all" && (
          <TouchableOpacity onPress={ShowFilterModal}>
            <Icon.AntDesign name="filter" size={24} color={theme.steel} />
          </TouchableOpacity>
        )}
      </View>

      {!disableDots && (
        <Collapsible style={styles.collapsible} collapsed={isCollapsed}>
          <TabItem
            isActive={horizontal}
            onPress={() => handleChangeDirection(true)}
            icon={
              <Icon.MaterialCommunityIcons
                name="align-horizontal-distribute"
                size={24}
                color={!horizontal ? theme.textColor : "white"}
              />
            }
          />
          <TabItem
            isActive={!horizontal}
            onPress={() => handleChangeDirection(false)}
            icon={
              <Icon.MaterialCommunityIcons
                name="align-vertical-distribute"
                size={24}
                color={horizontal ? theme.textColor : "white"}
              />
            }
          />

          <TabItem
            isActive={isTabActive}
            onPress={() => {
              setIsTabActive((prev) => !prev);
              setProgress(100);
            }}
            label="المشاريع المكتملة"
          />
        </Collapsible>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  collapsible: {
    width: 300,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
