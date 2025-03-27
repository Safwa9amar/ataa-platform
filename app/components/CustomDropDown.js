import { View, Text } from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";
import validator from "validator";
export default function CustomDropDown({
  handleChanges,
  data,
  valueField,
  value,
  labelField,
  searchField,
  icon,
  position,
  search,
  width = "100%",
  height = 40,
  style,
  props,
}) {
  const { theme } = useTheme();

  return (
    <Dropdown
      data={data}
      style={{
        width: width,
        height: height,
        alignSelf: "center",
        borderColor: validator.isEmpty(value?.toString() || "")
          ? theme.errorColor
          : theme.borderColor,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        ...style,
      }}
      {...props}
      dropdownPosition={position}
      containerStyle={{ backgroundColor: theme.mangoBlack, borderRadius: 10 }}
      itemTextStyle={{ color: theme.textColor }}
      activeColor={theme.buttonPrimary}
      inputSearchStyle={{ color: theme.textColor }}
      labelField={labelField}
      placeholder="اختر..."
      searchPlaceholder="ابحث عن..."
      selectedTextStyle={{ color: theme.textColor }}
      placeholderStyle={{ color: theme.textColor, textAlign: "right" }}
      searchField={searchField}
      search={search}
      valueField={valueField}
      value={value}
      renderLeftIcon={() => icon}
      onChange={handleChanges}
    />
  );
}
