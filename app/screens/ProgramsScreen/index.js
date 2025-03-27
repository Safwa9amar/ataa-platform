import React, { useCallback } from "react";
import { Alert } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DefaultScreen from "./DefaultScreen";
import ZakatScreen from "./ZakatScreen";
import BloodDonationScreen from "./bloodDoantionScreen/index";
import AdahiScreen from "./AdahiScreen";
import ZakatCalculatorScreen from "./ZakatCalculatorScreen";
import BloodDonationCondittion from "./bloodDoantionScreen/BloodDonationCondittion";
import BloodDonationOp from "./bloodDoantionScreen/BloodDonationOp";
import BloodDonationBooking from "./bloodDoantionScreen/BloodDonationBooking";
import CompletedCampagnDonation from "./campagneScreen/CompletedCampagnDonation";
import Campagnes from "./campagneScreen";
import CreateCampagnScreen from "./campagneScreen/CreateCampagnScreen";
import MyCampagns from "./campagneScreen/MyCampagns";
import MyBloodCampagn from "./bloodDoantionScreen/MyBloodCampagn";
import MyBloodCampagnDetails from "./bloodDoantionScreen/MyBloodCampagnDetails";
import CompletedCampagnDonationRapport from "./campagneScreen/CompletedCampagnDonationRapport";
import CompletedCampaignBloodDonation from "./bloodDoantionScreen/CompletedCampaignBloodDonation";
import CompletedCampagnBloodRapport from "./bloodDoantionScreen/CompletedCampagnBloodRapport";

import { useTheme } from "../../context/ThemeContext";
import { CurrencyProvider } from "../../context/CurrencyContext";
import { PreciousMetalsProvider } from "../../context/PreciousMetalsContext";
import { CreateCampaignProvider } from "../../context/CreateCampaignContext";
import UsersCampagn from "./campagneScreen/UsersCampagn";
import { ZakatProvider } from "../../context/ZakatContext";
import { CampaignProvider } from "../../context/CampaignContext";
import MyCampaignDetails from "./campagneScreen/MyCampaignDetails";
import ModelWrapper from "../../components/ModelWrapper";
import DonateNowModal from "../../modal/donation/DonateNowModal";
import MyAppointments from "./bloodDoantionScreen/MyAppointments";

const ProgrameStack = createNativeStackNavigator();

const ProgramsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const screenOptions = {
    contentStyle: { backgroundColor: theme.backgroundColor },
    headerShown: false,
  };

  const defaultScreenListeners = useCallback(
    ({ navigation }) => ({
      focus: () => {
        navigation.getParent().setOptions({
          headerShown: true,
        });
      },
    }),
    []
  );

  const screens = [
    {
      name: "DefaultScreen",
      component: DefaultScreen,
      listeners: defaultScreenListeners,
    },
    { name: "Campagnes", component: Campagnes },
    { name: "ZakatScreen", component: ZakatScreen },
    { name: "BloodDonation", component: BloodDonationScreen },
    { name: "AdahiScreen", component: AdahiScreen },
    { name: "ZakatCalculatorScreen", component: ZakatCalculatorScreen },
    { name: "BloodDonationCondittion", component: BloodDonationCondittion },
    { name: "BloodDonationOpportunities", component: BloodDonationOp },
    { name: "BloodDonationBooking", component: BloodDonationBooking },
    { name: "CompletedCampagnDonation", component: CompletedCampagnDonation },
    { name: "UsersCampagn", component: UsersCampagn },
    { name: "MyCampagns", component: MyCampagns },
    { name: "MyCampaignDetails", component: MyCampaignDetails },
    {
      name: "CompletedCampagnDonationRapport",
      component: CompletedCampagnDonationRapport,
    },
    { name: "MyBloodCampagn", component: MyBloodCampagn },
    { name: "MyBloodCampagnDetails", component: MyBloodCampagnDetails },
    {
      name: "CompletedCampaignBloodDonation",
      component: CompletedCampaignBloodDonation,
    },
    {
      name: "MyAppointments",
      component: MyAppointments,
    },
    
    {
      name: "CompletedCampagnBloodRapport",
      component: CompletedCampagnBloodRapport,
    },
    {
      name: "CreateCampagnScreen",
      component: CreateCampagnScreen,
    },
  ];

  return (
    <PreciousMetalsProvider>
      <CurrencyProvider>
        <CreateCampaignProvider>
          <CampaignProvider>
            <ZakatProvider>
              <ProgrameStack.Navigator
                initialRouteName="DefaultScreen"
                screenOptions={screenOptions}
              >
                {screens.map(({ name, component, listeners }) => (
                  <ProgrameStack.Screen
                    options={{
                      contentStyle: { backgroundColor: theme.backgroundColor },
                    }}
                    key={name}
                    name={name}
                    component={component}
                    listeners={listeners}
                  />
                ))}
              </ProgrameStack.Navigator>
              {/* <ModelWrapper
                closeModel={closeDonationModal}
                isModelOpen={showDonationModal}
                height="85%"
              >
                <DonateNowModal />
              </ModelWrapper> */}
            </ZakatProvider>
          </CampaignProvider>
        </CreateCampaignProvider>
      </CurrencyProvider>
    </PreciousMetalsProvider>
  );
};

export default ProgramsScreen;
