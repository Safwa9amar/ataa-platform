import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import Badges from "../Badges";
import Text from "../Text";
import { useAppContext } from "../../context/AppContext";

const NationalBloodDonation = ({
  id = 1,
  image,
  badgeColor,
  badgeTitle,
  title,
  remainingAmount,
  width = 300,
  customStyles,
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

  const handlePress = () => {
    navigation.navigate("BloodDonationBooking", {
      BloodDonationBooking: id,
    });
  };

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
      {Platform !== "web" && (
        <Carousel
          contentContainerCustomStyle={{}}
          data={[image, image, image]}
          renderItem={({ item }) => (
            <Image source={item} style={styles.image} />
          )}
          sliderWidth={screenDimensions.width - 20}
          itemWidth={screenDimensions.width - 20}
          layout={carouselLayout}
          autoplayInterval={3000}
        />
      )}
      <View style={[styles.overlay, { width: screenDimensions.width - 20 }]}>
        <Text type="md" style={styles.title}>
          {title}
        </Text>
        <Text type="sm" style={styles.remainingAmount}>
          اجمالي الوحدات المجموعة : {remainingAmount}
        </Text>
        <TouchableOpacity onPress={handlePress}>
          <Badges width={150} bgColor={badgeColor} title={badgeTitle} />
        </TouchableOpacity>
      </View>
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
});

export default NationalBloodDonation;
