import React from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { useTheme } from "../../context/ThemeContext";
import Text from "../Text";

const AmountButton = ({
  amount,
  activeAmount,
  onPress,
  label = " دينار جزائري",
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.amountBtn,
        {
          backgroundColor:
            activeAmount === amount ? theme.buttonPrimary : theme.borderColor,
        },
      ]}
    >
      <Text
        style={{
          color: activeAmount === amount ? theme.white : theme.textColor,
        }}
      >
        {amount}
      </Text>
      <Text
        type="sm"
        style={{
          color: activeAmount === amount ? theme.white : theme.textColor,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

AmountButton.propTypes = {
  amount: PropTypes.number.isRequired,
  activeAmount: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  amountBtn: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
});

export default AmountButton;
