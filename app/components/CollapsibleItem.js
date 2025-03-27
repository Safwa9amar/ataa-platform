import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Text from "./Text";
import Collapsible from "react-native-collapsible";
import { useEffect, useState } from "react";

const CollapsibleItem = ({
  label,
  children,
  style,
  icon,
  isCollapsed = true,
  onPress,
  fontSize,
  progressBar,
}) => {
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
    if (onPress) onPress();
  };
  useEffect(() => {
    setCollapsed(isCollapsed);
  }, [isCollapsed]);
  return (
    <>
      <TouchableOpacity
        style={{ ...style, ...styles.navigationItem }}
        onPress={toggleCollapse}
      >
        <View style={styles.progressBar}>
          {progressBar ? progressBar : null}
        </View>
        <MaterialCommunityIcons
          name={collapsed ? "chevron-down" : "chevron-up"}
          size={24}
          color={theme.secondaryColor}
        />
        <Text type={fontSize ? fontSize : "md"}>{label}</Text>
        {icon ? icon : null}
      </TouchableOpacity>
      <Collapsible style={{ gap: 10 }} collapsed={collapsed}>
        {children}
      </Collapsible>
    </>
  );
};

const styles = StyleSheet.create({
  navigationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBar: {
    position: "absolute",
    bottom: 10,
    left: 25,
    height: 5,
  },
});

export default CollapsibleItem;
