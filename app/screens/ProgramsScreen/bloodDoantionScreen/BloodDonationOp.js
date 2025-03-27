import { View, Text, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import { useHideNavbar } from "../../../context/NavbarVisibilityContext";
import CustomScreenHeader from "../../../components/CustomScreenHeader";
import SearchBar from "../../../components/SearchBar";
import Icon from "../../../components/Icon";
import ModelWrapper from "../../../components/ModelWrapper";
import DonationCardVariants from "../../../components/DonationCardVariants";
import ScreensContainer from "../../../components/ScreensContainer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabItem from "../../../components/TabItem";
import UsersCampagnes from "./UsersCampagnes";
import NationalesCampagnes from "./NationalesCampagnes";

const Tabs = createNativeStackNavigator();
export default function BloodDonationOp() {
  const navigation = useNavigation();
  const { isDarkMode, theme } = useTheme();
  const [activeTab, setActiveTab] = React.useState("UsersCampagnes");

  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader
          icon={
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
                gap: 5,
              }}
            >
              <Icon.Entypo name="drop" size={24} color={theme.textColor} />
              <Icon.MaterialCommunityIcons
                onPress={() => {
                  navigation.navigate("BloodDonationCondittion");
                }}
                name="dots-vertical"
                size={24}
                color={theme.textColor}
              />
            </View>
          }
          navigation={navigation}
          label="فرص التبرع بالدم"
        />
      ),
    });
  }, [navigation, isDarkMode]);
  return (
    <Tabs.Navigator
      screenOptions={{
        animation: "flip",
        header: () => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              margin: 10,
            }}
          >
            <TabItem
              isActive={activeTab === "NationalesCampagnes"}
              icon={
                <Icon.MaterialCommunityIcons
                  color={activeTab === "NationalesCampagnes" ? "white" : null}
                  name="bus-marker"
                  size={24}
                />
              }
              onPress={() => {
                navigation.navigate("NationalesCampagnes");
                setActiveTab("NationalesCampagnes");
              }}
              label="الحملات الوطنية"
            />
            <TabItem
              isActive={activeTab === "UsersCampagnes"}
              icon={
                <Icon.MaterialCommunityIcons
                  color={activeTab === "UsersCampagnes" ? "white" : null}
                  name="bag-personal"
                  size={24}
                />
              }
              onPress={() => {
                navigation.navigate("UsersCampagnes");
                setActiveTab("UsersCampagnes");
              }}
              label="حملات المستخدمين"
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen name="UsersCampagnes" component={UsersCampagnes} />
      <Tabs.Screen name="NationalesCampagnes" component={NationalesCampagnes} />
    </Tabs.Navigator>
  );
}

// <ScreensContainer>

// <DonationCardVariants.BloodDonationCard
//   image
//   title={"مستشفى الامومة والطفولة بجدة"}
//   BloodType={"B+"}
//   remainingAmount={10}
//   progress={0.3}
//   onPress={handleDonationCardPress}
// />
// <DonationCardVariants.BloodDonationCard
//   image
//   title={"اسم البنك"}
//   BloodType={"A-"}
//   remainingAmount={10}
//   onPress={handleDonationCardPress}
//   progress={0.3}
// />

// <ModelWrapper isModelOpen={showModel} closeModel={closeModel}>
//   <View
//     style={{
//       backgroundColor: theme.backgroundColor,
//       padding: 10,
//       borderRadius: 10,
//       margin: 10,
//     }}
//   >
//     <Text style={{ color: theme.textColor }}>
//       يمكنك التبرع بالدم في مركز الدم بالمستشفى الجامعي الدكتور حسن الفقيه
//       بجدة
//     </Text>
//   </View>
// </ModelWrapper>
// </ScreensContainer>
