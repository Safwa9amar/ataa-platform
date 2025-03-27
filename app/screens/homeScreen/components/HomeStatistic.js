import {
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";
import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Text from "../../../components/Text";
import { useTheme } from "../../../context/ThemeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import AnimatedNumbers from "react-native-animated-numbers";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API_ENDPOINTS from "../../../config/config";

// Conditional LinearGradient import with better web fallback
let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  LinearGradient = ({ children, style, colors, ...props }) => (
    <div
      style={{
        ...style,
        background: `linear-gradient(to right, ${colors.join(", ")})`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default function HomeStatistic() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [statisticData, setStatisticData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const getData = async () => {
    try {
      const { data } = await axios.get(API_ENDPOINTS.GET_STATISTICS);
      if (data?.data) {
        setStatisticData(data.data);
      }
    } catch (err) {
      console.error("Statistics fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const statisticCardsData = [
    {
      title: "الفرص المكتملة",
      value: statisticData?.completedOpportunities,
      key: "completedOpportunities",
      icon: "checkcircleo",
    },
    {
      title: "مجالات التبرع",
      value: statisticData?.donationFields,
      key: "donationFields",
      icon: "appstore-o",
    },
    {
      title: "الفرص النشطة",
      value: statisticData?.remainingOpportunities,
      key: "remainingOpportunities",
      icon: "clockcircleo",
    },
    {
      title: "عدد عمليات التبرع",
      value: statisticData?.totalDonations,
      key: "totalDonations",
      icon: "gift",
    },
    {
      title: "عدد المستفيدين",
      value: statisticData?.totalNumberOfBeneficiaries,
      key: "totalNumberOfBeneficiaries",
      icon: "team",
    },
  ].filter((item) => item.value > 0);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme.error }}>
          Error loading statistics: {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 30, alignItems: "center", margin: 10 }}>
      <LinearGradient
        colors={["#00BCD4", "#458E59"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: "100%",
          height: 80,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 90, height: 70, resizeMode: "contain" }}
          source={require("../../../assets/images/SiteStats.png")}
        />
        <Text
          style={{
            color: "white",
            fontSize: 25,
            fontFamily: "YourArabicFontHere",
          }}
        >
          عطاء في ارقام
        </Text>
      </LinearGradient>

      {statisticData ? (
        <FlatList
          data={statisticCardsData}
          keyExtractor={(item) => item.key}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 10,
            marginBottom: 15,
          }}
          contentContainerStyle={{
            gap: 15,
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <StatisticCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              color="#09D9C6"
            />
          )}
        />
      ) : null}

      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <AntDesign name="doubleleft" size={16} color={theme.textColor} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AtaaInNumbers");
          }}
          activeOpacity={0.7}
        >
          <Text
            fontSize={18}
            style={{ color: theme.textColor, textDecorationLine: "underline" }}
          >
            تفاصيل اكثر عن الاحصائيات
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const StatisticCard = ({ title, value, icon, color }) => {
  const { theme } = useTheme();
  const [displayValue, setDisplayValue] = React.useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const numericValue = Number(value) || 0;
    setDisplayValue(numericValue);

    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [value, fadeAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        width: Dimensions.get("window").width / 2 - 25,
        height: 120,
        borderRadius: 10,
        overflow: "hidden",
      }}
    >
      <LinearGradient
        colors={["#09D9C6", "#00BCD4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
          {value}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, marginTop: 4 }}>
            {title}
          </Text>
          <AntDesign name={icon} size={18} color="white" />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string,
};

StatisticCard.defaultProps = {
  color: "#09D9C6",
};
