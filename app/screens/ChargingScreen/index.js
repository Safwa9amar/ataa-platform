import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import DatePicker from "react-native-date-picker";
import CollapsibleItem from "../../components/CollapsibleItem";
import BalanceUsesTable from "./BalanceUsesTable";
import ScreensContainer from "../../components/ScreensContainer";
import Text from "../../components/Text";
import { useIsDrawerOpen } from "../../context/DrawerContext";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../../components/Icon";
import ModelWrapper from "../../components/ModelWrapper";
import TabItem from "../../components/TabItem";
import { Button } from "../../components/ButtonWithLabel";
import Collapsible from "react-native-collapsible";
import RapportModal from "../../modal/RapportModal";
import ContactDivider from "../../components/ContactDivider";
import PrimaryBtn from "../../components/PrimaryBtn";
import ChargeMyBalanceModal from "../../modal/ChargeMyBalanceModal";
import { useCredentials } from "../../context/CredentialsContext";
import { Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import RechrgesHistoryTable from "./RechrgesHistoryTable";
import API_ENDPOINTS from "../../config/config";

const CharingDonationHistory = ({ route }) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useCredentials();
  const { closeDrawer } = useIsDrawerOpen();
  const { setHideNavbar } = useHideNavbar();
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const [modalVisibility, setModalVisibility] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [activeItem, setActiveItem] = useState("donationHistory");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {},
      headerTitle: "سجل الرصيد المالي",
      headerTitleStyle: { color: theme.textColor },
    });

    setHideNavbar(true);
    closeDrawer();
    return () => {
      setHideNavbar(false);
    };
  }, []);

  const handleToggle = (item) => {
    setActiveItem((prevItem) => (prevItem === item ? null : item));
    setDate(null);
  };
  const closeModel = () => {
    setShowModal(false);
  };



  return (
    <ScreensContainer>
      <LinearGradient
        colors={["#EFEEBC", "#AAEEAC"]}
        style={{
          height: 200,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
          margin: 10,
        }}
      >
        <Image
          source={require("../../assets/logo/fullLogo.png")}
          style={{ width: 100, height: 100 }}
        />
        <PrimaryBtn title={"شحن حسابي"} onPress={() => setShowModal(true)} />
      </LinearGradient>

      <CollapsibleItem
        isCollapsed={activeItem !== "donationHistory"}
        style={styles.collapsibleItem(theme)}
        label={"تاريخ وتوقيت كل شحن"}
        icon={
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => {
              activeItem === "donationHistory" && setOpen(true);
            }}
          >
            <View>
              <IndicatorState active={activeItem === "donationHistory"} />
              <Icon.FontAwesome5
                name="calendar-alt"
                size={24}
                color={theme.secondaryColor}
              />
            </View>
          </TouchableOpacity>
        }
        onPress={() => handleToggle("donationHistory")}
      >
        {activeItem === "donationHistory" && (
          <RechrgesHistoryTable date={date} />
        )}
      </CollapsibleItem>

      <CollapsibleItem
        isCollapsed={activeItem !== "balanceUses"}
        style={styles.collapsibleItem(theme)}
        label={"استعمالات الرصيد"}
        icon={
          <TouchableOpacity
            onPress={() => {
              activeItem === "balanceUses" && setOpen(true);
            }}
          >
            <IndicatorState active={activeItem === "balanceUses"} />
            <Icon.FontAwesome5
              name="money-check"
              size={24}
              color={theme.secondaryColor}
            />
          </TouchableOpacity>
        }
        onPress={() => handleToggle("balanceUses")}
      >
        {activeItem === "balanceUses" && <BalanceUsesTable date={date} />}
      </CollapsibleItem>

      <CollapsibleItem
        isCollapsed={activeItem !== "report"}
        style={styles.collapsibleItem(theme)}
        label={"عرض التقرير"}
        icon={
          <Icon.FontAwesome5
            name="file-invoice"
            size={24}
            color={theme.secondaryColor}
          />
        }
        onPress={() => handleToggle("report")}
      >
        <View style={{ alignItems: "center" }}>
          <ContactDivider label={"من تاريخ"} />
          <DatePicker
            mode="date"
            locale="ar-DZ"
            minimumDate={new Date("2024-01-01")}
            theme={isDarkMode ? "dark" : "light"}
            date={startDate ? startDate : new Date()}
            onDateChange={(date) => {
              setStartDate(date);
            }}
          />
          <ContactDivider label={"حتى تاريخ"} />
          <DatePicker
            mode="date"
            locale="ar-DZ"
            theme={isDarkMode ? "dark" : "light"}
            date={endDate ? endDate : new Date()}
            onDateChange={(date) => {
              setEndDate(date);
            }}
          />
        </View>
        <Button
          onPress={() => setModalVisibility(true)}
          bgColor={theme.secondaryColor}
          isActive
          label="عرض التقرير"
        />
      </CollapsibleItem>

      <DatePicker
        modal
        dividerColor={theme.textColor}
        theme={isDarkMode ? "dark" : "light"}
        mode="date"
        open={open}
        locale="ar-DZ"
        date={new Date()}
        maximumDate={new Date()}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      <ModelWrapper
        height="82%"
        closeModel={() => setModalVisibility(false)}
        isModelOpen={modalVisibility}
      >
        <RapportModal
          data={{
            name: "تقرير الرصيد",
            rapportType: "UserBalanceReport",
            from: startDate,
            to: endDate,
            URI: API_ENDPOINTS.REPPORTS.GET_USER_BALANCE_REPPORTS,
          }}
        />
      </ModelWrapper>
      <ModelWrapper closeModel={closeModel} isModelOpen={showModal}>
        <ChargeMyBalanceModal />
      </ModelWrapper>
    </ScreensContainer>
  );
};

const IndicatorState = ({ active }) => {
  return (
    active && (
      <View
        style={{
          zIndex: 1,
          position: "absolute",
          bottom: -5,
          left: -5,
          width: 10,
          height: 10,
          borderRadius: 15,
          backgroundColor: "red",
        }}
      />
    )
  );
};

export const styles = StyleSheet.create({
  collapsibleItem: (theme) => ({
    backgroundColor: theme.mangoBlack,
    padding: 10,
    margin: 10,
  }),
  table: {
    marginHorizontal: 10,
  },
  tableBorder: (borderColor) => ({
    borderColor: borderColor,
    borderWidth: 2,
  }),
  head: (secondaryColor) => ({
    height: 40,
    backgroundColor: secondaryColor,
  }),
  text: (color) => ({
    margin: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: color,
  }),
});

export default CharingDonationHistory;
