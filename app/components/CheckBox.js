import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";
import Text from "./Text";

const Checkbox = ({ checked, onPress }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? theme.buttonPrimary : "transparent",
            borderColor: checked ? theme.buttonPrimary : theme.steel,
          },
        ]}
      >
        {checked && <MaterialIcons name="check" size={20} color="white" />}
      </View>
    </TouchableOpacity>
  );
};

export const CheckBoxLabled = ({ checked, onPress, label, type = "md" }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
      <Text type={type}>{label}</Text>
      <Checkbox onPress={onPress} checked={checked} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#888",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "flex-end",
    gap: 10,
  },
});

export default Checkbox;
