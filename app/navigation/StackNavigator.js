import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/AccountScreen/ProfileScreen";
import SavedOpportunities from "../screens/SavedOpportunities";
import StartScreen from "../screens/startScreen/StartScreen";
import CommonQuestions from "../screens/CommonQuestions";
import ContactUsScreen from "../screens/ContactUsScreen";
import ProgramsScreen from "../screens/ProgramsScreen";
import AppGuideScreen from "../screens/AppGuideScreen";
import DonationScreen from "../screens/DonationScreen";
import LoginFirstPage from "../screens/AccountScreen";
import PrivacyPolicy from "../screens/PrivacyPolicy";
import Login from "../screens/AccountScreen/Login";
import { useAppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import StoreScreen from "../screens/StoreScreen";
import { HeaderLeft, HeaderRight } from "./Header";
import HomeScreen from "../screens/homeScreen";
import React, { useLayoutEffect } from "react";
import ProductDetails from "../components/ProductDetails";
import CartScreen from "../screens/CartScreen";
import DoantionCardDetaills from "../screens/DoantionCardDetaills";
import Notifications from "../screens/Notifications";
import CharingDonationHistory from "../screens/ChargingScreen";
import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { FieldCategoryProvider } from "../context/FieldCategoryContext";
import { AlgeriaCitiesProvider } from "../context/AlgeriaCitiesContext";
import { useNavigation } from "@react-navigation/native";
import { useCredentials } from "../context/CredentialsContext";
import DonationsHistory from "../screens/DonationsHistoryScreen";
import { getCommonHeaders } from "../services/getCommonHeaders";
import KafalatDonationCardDetaills from "../screens/KafalatDonationCardDetaills";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const { checkAuthentication, userToken } = useCredentials();
  const { isDarkMode, theme } = useTheme();
  const { isFirstTime, setAppIsReady, userInterface, setLoading } =
    useAppContext();
  const screens = [
    isFirstTime ? { name: "StartScreen", component: StartScreen } : null,
    {
      name: "Home",
      options: {
        animation: "slide_from_left",
      },
      component: HomeScreen,
    },
    { name: "DonationScreen", component: DonationScreen },
    { name: "ProgramsScreen", component: ProgramsScreen },
    {
      name: "StoreScreen",
      component: StoreScreen,
    },
    {
      name: "CartScreen",
      component: CartScreen,
      options: {
        animation: "fade",
      },
    },
    { name: "ContactUsScreen", component: ContactUsScreen },
    { name: "CharingDonationHistory", component: CharingDonationHistory },
    { name: "DonationsHistory", component: DonationsHistory },
    { name: "DoantionCardDetaills", component: DoantionCardDetaills },
    { name: "KafalatDonationCardDetaills", component: KafalatDonationCardDetaills },
    { name: "AppGuide", component: AppGuideScreen },
    { name: "CommonQuestions", component: CommonQuestions },
    { name: "PrivacyPolicy", component: PrivacyPolicy },
    { name: "SavedOpportunities", component: SavedOpportunities },
    { name: "LoginFirstPage", component: LoginFirstPage },
    { name: "ProfileScreen", component: ProfileScreen },
    {
      name: "Product",
      component: ProductDetails,
      options: {
        animation: "simple_push",
        headerShown: false,
      },
    },
    {
      name: "Login",
      component: Login,
      options: {
        animation: "slide_from_right",
        headerShown: false,
      },
    },
    {
      name: "Notifications",
      component: Notifications,
      options: {
        animation: "fade",
      },
    },
  ];

  useLayoutEffect(() => {
    setAppIsReady(true);
    axios
      .get(API_ENDPOINTS.CHECK_SERVER_STATUS, {
        headers: getCommonHeaders(),
      })
      .then((res) => {
        console.log("Server status: ", res.data);
      })
      .catch((error) => {
        console.error("Server error:", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
    checkAuthentication(userToken);
  }, []);

  return (
    <FieldCategoryProvider>
      <AlgeriaCitiesProvider>
        <Stack.Navigator
          screenOptions={{
            orientation: "default",
            title: "",
            headerRight: () => <HeaderRight />,
            headerLeft: () => <HeaderLeft />,
            headerStyle: {
              backgroundColor: theme.navBg,
            },
            animation: userInterface.screensAnimation || "slide_from_right",
            statusBarStyle: isDarkMode ? "light" : "dark",
            statusBarColor: theme.navBg,
            contentStyle: {
              backgroundColor: theme.backgroundColor,
            },
          }}
        >
          {screens.filter(Boolean).map(({ name, component, options }) => (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={options}
            />
          ))}
        </Stack.Navigator>
      </AlgeriaCitiesProvider>
    </FieldCategoryProvider>
  );
};

export default StackNavigator;
