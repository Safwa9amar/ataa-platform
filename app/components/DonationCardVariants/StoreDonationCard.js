import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import Badges from "../Badges";
import Text from "../Text";
import { useAppContext } from "../../context/AppContext";
import DefaultSkeletonLoader from "../skeleton/DefaultSkeletonLoader";
import { Platform } from "react-native";

const StoreDonationCard = ({
  id = 1,
  image,
  badgeColor,
  badgeTitle,
  title,
  description,
  remainingAmount,
  width = 300,
  customStyles,
  isLoading = false, // Add isLoading prop
  onPress,
}) => {
  const navigation = useNavigation();
  const { carouselLayout } = useAppContext();
  const screenDimensions = Dimensions.get("screen");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateYAnim]);

  if (isLoading) {
    return (
      <View style={[styles.container, customStyles]}>
        <DefaultSkeletonLoader
          height={200}
          width={screenDimensions.width - 20}
          style={styles.skeletonImage}
        />
        <View
          style={{
            width: screenDimensions.width - 20,
            alignItems: "flex-end",
            paddingHorizontal: 20,
          }}
        >
          <DefaultSkeletonLoader height={20} width={200} />
          <DefaultSkeletonLoader
            height={20}
            width={150}
            style={styles.skeletonText}
          />
          <DefaultSkeletonLoader
            height={20}
            width={100}
            style={styles.skeletonText}
          />
        </View>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: screenDimensions.width - 20,
          opacity: fadeAnim,
          transform: [{ translateY: translateYAnim }],
          ...customStyles,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={[styles.overlay, { width: screenDimensions.width - 20 }]}>
          <Text type="md" style={styles.title}>
            {title}
          </Text>
          <Text type="sm" style={styles.title}>
            {description}
          </Text>

          <Text type="sm" style={styles.remainingAmount}>
            عدد الوحدات المتبقية : {remainingAmount}
          </Text>
          <Badges width={150} bgColor={badgeColor} title={badgeTitle} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 350,
    margin: 10,
    borderRadius: 20,
    borderColor: "#B5B3B320",
    borderWidth: 2,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "#00000088",
    padding: 20,
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  title: {
    color: "white",
  },
  remainingAmount: {
    color: "white",
  },
  skeletonImage: {
    borderRadius: 20,
    marginBottom: 10,
  },
  skeletonText: {
    marginBottom: 10,
  },
  skeletonBadge: {
    borderRadius: 20,
  },
});

export default StoreDonationCard;
