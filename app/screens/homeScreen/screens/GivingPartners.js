import React, { useEffect, useRef } from "react";
import {
  Image,
  ImageBackground,
  RefreshControl,
  View,
  Animated,
  FlatList,
} from "react-native";
import ScreensContainer from "../../../components/ScreensContainer";
import Text from "../../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import CustomHeader from "../../../navigation/CustomHeader";
import ReSVG from "../../../assets/vectors/ReSvg";
import API_ENDPOINTS from "../../../config/config";

const GivingPartners = () => {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.GIVINGPARTNERS.GET_ALL);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getData} />
      }
    >
      <View style={styles.mainContainer}>
        <Image
          style={styles.mainImage}
          source={require("../../../assets/images/24ae8adbb726c3c50cbbb3e0d2bec063.jpeg")}
        />
        <View style={styles.overlayContainer}>
          <CustomHeader
            style={{
              position: "absolute",
              top: 0,
            }}
          />
          <Text
            type="headingLarge"
            style={{
              ...styles.overlayText,
              color: theme.white,
            }}
          >
            شركاء عطاء
          </Text>
          <Text
            style={{
              ...styles.overlayDescription,
              color: theme.steel,
            }}
            type="bodyTextSmall"
          >
            للخير وسائل متعددة، وأبواب الإحسان كثيرة. لهذا السبب، تقدم العديد من
            المؤسسات مبادرات وخدمات لمنصة عطاء
          </Text>
        </View>
      </View>

      <View
        style={{
          ...styles.partnerCardContainer,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <ReSVG
          style={{
            marginTop: 5,
            position: "absolute",
          }}
        />

        <FlatList
          data={data}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <RenderPartnerCard
              key={index}
              partnerName={item.name}
              partnerImage={{ uri: item.logo }}
              index={index}
            />
          )}
          contentContainerStyle={styles.partnerCardList}
        />
      </View>
    </ScreensContainer>
  );
};

export const RenderPartnerCard = ({ partnerName, partnerImage, index }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity: 0
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Initial scale: 0.8

  useEffect(() => {
    // Animate opacity and scale when the component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100, // Staggered delay based on index
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100, // Staggered delay based on index
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        margin: 10,
      }}
    >
      <ImageBackground
        resizeMode="stretch"
        progressiveRenderingEnabled
        source={partnerImage}
        style={styles.partnerCardContent}
        borderRadius={20}
      >
        <View style={styles.overlay}>
          <Text
            type="sm"
            style={{
              ...styles.partnerCardText,
              color: theme.white,
            }}
          >
            {partnerName}
          </Text>
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = {
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  partnerCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
    zIndex: 99,
    top: -120,
    padding: 20,
    borderTopStartRadius: 35,
    borderTopEndRadius: 35,
  },
  partnerCardContent: {
    height: 150,
    width: 150,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  partnerCardText: {
    marginBottom: 30,
    marginRight: 10,
  },
  overlay: {
    backgroundColor: "#00000099",
    width: "100%",
    position: "absolute",
    alignItems: "flex-end",
    borderRadius: 10,
  },
  mainContainer: {
    height: 355,
  },
  mainImage: {
    width: "100%",
    height: 355,
    borderRadius: 10,
  },
  overlayContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 99,
    backgroundColor: "#000000BF",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 120,
  },
  overlayText: {},
  overlayDescription: {},
  partnerCardList: {
    justifyContent: "center",
    alignItems: "center",
  },
};

export default GivingPartners;
