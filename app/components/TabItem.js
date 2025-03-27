import { Pressable } from "react-native";
import { useTheme } from "../context/ThemeContext";
import Text from "./Text";

const TabItem = ({ isActive, label, onPress, icon, reversed, bg }) => {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: reversed ? "row-reverse" : "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: bg
          ? bg
          : isActive
          ? theme.buttonPrimary
          : theme.mangoBlack,
        padding: 10,
        paddingHorizontal: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        borderColor: theme.borderColor,
        borderWidth: 1,
      }}
    >
      {label && (
        <Text
          style={{ color: isActive ? "white" : theme.textColor }}
          center
          type="navigationText"
        >
          {label}
        </Text>
      )}
      {icon}
    </Pressable>
  );
};

export default TabItem;
