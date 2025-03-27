import React, { useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import Text from "./Text";
import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";

const AnimatedCampaignsCard = ({
  item,
  index,
  onPress,
  image,
  label,
  description,
  children,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  const { theme } = useTheme();
  let isVisible = true; // TODO : update this later so whem user scroll to view it show th card
  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Animated.View
      key={index}
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateYAnim }],
      }}
    >
      <CampaignsCard
        Ionicons={item?.Ionicons}
        FontAwesome5={item?.FontAwesome5}
        MaterialIcons={item?.MaterialIcons}
        Fontisto={item?.Fontisto}
        iconName={item?.iconName}
        onPress={onPress}
        image={image}
        label={label}
        description={description}
      >
        {children}
      </CampaignsCard>
    </Animated.View>
  );
};

const CampaignsCard = ({
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Fontisto,
  iconName,
  onPress,
  image,
  label,
  description,
  children,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { borderColor: theme.borderColor, backgroundColor: theme.mangoBlack },
      ]}
    >
      {image && <Image source={image} style={styles.image} />}
      {children}
      <View style={[styles.textContainer]}>
        <View style={styles.row}>
          <Text type="md">{label}</Text>
          {Ionicons && (
            <Icon.Ionicons name={iconName} size={20} color={theme.textColor} />
          )}
          {FontAwesome5 && (
            <Icon.FontAwesome5
              name={iconName}
              size={20}
              color={theme.textColor}
            />
          )}
          {MaterialIcons && (
            <Icon.MaterialIcons
              name={iconName}
              size={20}
              color={theme.textColor}
            />
          )}
          {Fontisto && (
            <Icon.Fontisto name={iconName} size={20} color={theme.textColor} />
          )}
        </View>
        <Text style={{ color: theme.steel }} type="sm">
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingRight: 20,
    paddingVertical: 10,
    margin: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
  },
  image: {
    width: 70,
    height: 70,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default AnimatedCampaignsCard;
