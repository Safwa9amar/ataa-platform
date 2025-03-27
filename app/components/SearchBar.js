import React from "react";
import { TextInput, View } from "react-native";
import SearchSvg from "../assets/vectors/SearchSvg";
import { useTheme } from "../context/ThemeContext";
import useDebouncedSearch from "../hooks/useDebouncedSearch";

export default function SearchBar({
  fetchDataCallback, // Pass this callback to perform the actual fetch
  width = "70%",
  hide = false,
  align,
  placeholderText = "ابحث عن...",
  ...props
}) {
  const { theme } = useTheme();
  const handleSearch = useDebouncedSearch(fetchDataCallback);

  return (
    <View
      style={{
        display: hide ? "none" : "flex",
        width: width,
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: align,
        backgroundColor: theme.mangoBlack,
        borderColor: theme.borderColor,
        borderWidth: 1,
        padding: 5,
        margin: 10,
        borderRadius: 10,
      }}
    >
      <TextInput
        {...props}
        style={{
          flex: 1,
          padding: 5,
          fontSize: 14,
          backgroundColor: theme.mangoBlack,
          borderRadius: 10,
          textAlign: "right",
          fontFamily: "ElMessiri",
          color: theme.textColor,
        }}
        placeholderTextColor={theme.steel}
        placeholder={placeholderText}
        onChange={handleSearch}
      />
      <SearchSvg />
    </View>
  );
}
