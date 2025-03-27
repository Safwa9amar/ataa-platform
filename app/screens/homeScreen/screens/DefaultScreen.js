import React, { useEffect } from "react";
import ScreensContainer from "../../../components/ScreensContainer";
import HomeCarousel from "../components/HomeCarousel";
import HomeNavigation from "../components/HomeNavigation";
import HomeDonationCarousel from "../components/HomeDonationCarousel";
import HomeStatistic from "../components/HomeStatistic";
import { View, Image, RefreshControl } from "react-native";
import Text from "../../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useHideNavbar } from "../../../context/NavbarVisibilityContext";
import API_ENDPOINTS from "../../../config/config";

import { Platform } from "react-native";
import { getAllDonationOpportunitiesForHome } from "../../../services/donationOpportunityService";
import { useCredentials } from "../../../context/CredentialsContext";
import TypingText from "../../../components/TypingText";
import DonationOpportunityForm from "./DonationOpportunityForm";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}
export default function DefaultScreen() {
  const navigation = useNavigation();
  const { userToken } = useCredentials();
  const { setHideNavbar } = useHideNavbar();
  const [refreshing, setRefreshing] = React.useState(false);
  const [donationData, setDonationData] = React.useState([]);

  const getDonationData = async () => {
    let data = await getAllDonationOpportunitiesForHome(userToken);
    if (data) {
      setDonationData(data);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getDonationData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getDonationData();
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      setHideNavbar(false);
      navigation.getParent().setOptions({
        headerShown: true,
      });
    });
  }, [navigation]);

  return (
    <ScreensContainer
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <HomeCarousel />
      <HomeNavigation />
      <LinearGradient
        colors={["#458E59", "#00BCD4"]}
        //  from rith to left
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: 20,
          height: 82,
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          margin: 10,
          marginBottom: 40,
          alignItems: "center",
          position: "relative",
        }}
      >
        <TypingText
          text="﴿وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ﴾"
          style={{
            color: "white",
            fontSize: 22,
            textAlign: "center",
            fontFamily: "ReemKufi-Medium",
          }}
        />

        <Image
          style={{
            backgroundColor: "#B4E6C2",
            width: 45,
            height: 45,
            position: "absolute",
            bottom: -20,
            left: 20,
            borderRadius: 100,
          }}
          source={require("../../../assets/images/image17.png")}
        />
      </LinearGradient>
      {donationData ? (
        <HomeDonationCarousel donationData={donationData} />
      ) : (
        <ActivityIndicator size="large" color="#00ff00" />
      )}
      <HomeStatistic />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          marginBottom: 50,
        }}
      >
        <TypingText
          text="﴿لَن تَنَالُوا الْبِرَّ حَتَّى تُنفِقُوا مِمَّا تُحِبُّونَ﴾"
          style={{
            fontSize: 22,
            textAlign: "center",
            fontFamily: "ReemKufi-Medium",
          }}
        />

        <Image
          style={{
            width: 200,
            height: 107,
          }}
          source={require("../../../assets/images/image_18.png")}
        />
      </View>
    </ScreensContainer>
  );
}
