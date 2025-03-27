import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import ScreensContainer from "../../../components/ScreensContainer";
import Text from "../../../components/Text";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import CustomHeader from "../../../navigation/CustomHeader";
import ReSVG from "../../../assets/vectors/ReSvg";
import ArrowDownSvg from "../../../assets/vectors/ArrowDownSvg";
import AnimatedNumbers from "react-native-animated-numbers";
import TypingText from "../../../components/TypingText";
import { getAllDonations } from "../../../services/donationService";
import { useCredentials } from "../../../context/CredentialsContext";
import API_ENDPOINTS from "../../../config/config";
import axios from "axios";

const AtaaInNumbers = () => {
  const { userToken } = useCredentials();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [animateToNumber, setAnimateToNumber] = useState(0);

  // Fetch donations and calculate the total amount
  const getDonations = useCallback(async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.GET_STATISTICS);
      setAnimateToNumber(data.data?.totalDonatedAmount);
    } catch (error) {
      console.error(error);
    }
  }, [userToken]);

  // Set interval to update donations every 30 seconds
  useEffect(() => {
    getDonations(); // Initial fetch

    const interval = setInterval(() => {
      getDonations(); // Fetch donations at each interval
    }, 30000); // 30 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  useEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const totalDonationText = useMemo(() => {
    return animateToNumber > 0
      ? "المبلغ الإجمالي المتبرع به عبر منصة عطاء"
      : "لم يتم تسجيل أي تبرعات حتى الآن";
  }, [animateToNumber]);

  return (
    <ScreensContainer>
      <View style={styles.mainContainer}>
        <Image
          style={styles.mainImage}
          source={require("../../../assets/images/attaunnumbers.png")}
        />
        <View style={styles.overlayContainer}>
          <CustomHeader style={{ position: "absolute", top: 0 }} />
          <Text
            type="headingLarge"
            style={{
              ...styles.overlayText,
              color: theme.white,
            }}
          >
            عطاء في أرقام
          </Text>
        </View>
      </View>

      <View
        style={{
          ...styles.partnerCardContainer,
          backgroundColor: theme.backgroundColor,
        }}
      >
        <ReSVG style={{ marginTop: 5, position: "absolute" }} />

        <View style={styles.donationAmountContainer}>
          <Text style={styles.currencyText}>دج</Text>
          <AnimatedNumbers
            animateToNumber={animateToNumber}
            fontStyle={styles.animatedNumberStyle}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text type="bodyTextSmall">{totalDonationText}</Text>

          <TypingText
            center
            textSize="xxl"
            text={`“مَنْ ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً`}
            style={styles.quranText}
          />

          <Text style={styles.statisticsHeader} type="headingSmall">
            إحصائيات عامة
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("GeneralStatistics", {
                isComingFromAtaaInNumbers: true,
              });
            }}
          >
            <ArrowDownSvg />
          </TouchableOpacity>
        </View>
      </View>
    </ScreensContainer>
  );
};

const styles = {
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
  donationAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#209FA6",
    width: 250,
  },
  currencyText: {
    fontSize: 28,
  },
  animatedNumberStyle: {
    fontSize: 28,
    fontFamily: "SecularOne-Regular",
    fontWeight: "bold",
    color: "#209FA6",
  },
  infoContainer: {
    justifyContent: "space-evenly",
    alignItems: "center",
    gap: 30,
  },
  quranText: {
    color: "#209FA6",
    textAlign: "center",
    fontFamily: "ReemKufi-Medium",
  },
  statisticsHeader: {
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  refreshButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#209FA6",
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
};

export default AtaaInNumbers;
