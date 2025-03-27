import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import EditIcon from "react-native-vector-icons/Feather";
import Text from "../Text";
import SwitchWithIcon from "../SwitchWithIcon";
import { useTheme } from "../../context/ThemeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useIsDrawerOpen } from "../../context/DrawerContext";
import CollapsibleItem from "../CollapsibleItem";
import { useCredentials } from "../../context/CredentialsContext";
import Icon from "../Icon";
import API_ENDPOINTS from "../../config/config";

import { Platform } from "react-native";
import RankIcons from "../RankIcons";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}

const DrawerContent = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(true);
  const { isLoggedIn, user, logout, loading } = useCredentials();
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  const { closeDrawer } = useIsDrawerOpen();

  return (
    <>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {!isLoggedIn && (
          <Image
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              marginTop: 20,
            }}
            source={require("../../assets/logo/Mainlogo.png")}
          />
        )}
        {loading && (
          <ActivityIndicator size="large" color={theme.primaryColor} />
        )}
        {isLoggedIn && (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["#00BCD4", "#458E59"]}
            style={[
              styles.rowContainer,
              {
                borderRadius: 10,
                padding: 10,
              },
            ]}
          >
            <View style={styles.textContainer}>
              <TouchableOpacity
                style={styles.textWithIcon}
                onPress={() => {
                  navigation.navigate("ProfileScreen");
                  closeDrawer();
                }}
              >
                <Text color={theme.white} type="md">
                  {user?.name}
                </Text>
                <EditIcon name="edit" size={20} color={theme.white} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Text color={theme.white} type="sm">
                  {isDarkMode ? "الوضع الليلي" : "الوضع العادي"}{" "}
                </Text>
                <SwitchWithIcon
                  onImage={require("../../assets/icons/sun.png")}
                  offImage={require("../../assets/icons/moon.png")}
                />
              </View>
            </View>
            {user?.photo && (
              <Avatar
                image={
                  user?.photo.startsWith("http")
                    ? { uri: user?.photo }
                    : {
                        uri: `${API_ENDPOINTS.UPLOADS}/${user?.photo}`,
                      }
                }
              />
            )}
          </LinearGradient>
        )}

        {isLoggedIn && (
          <>
            <View
              style={[
                styles.rowContainer,
                styles.balanceContainer,
                {
                  backgroundColor: theme.mangoBlack,
                  borderColor: theme.borderColor,
                  borderWidth: 1,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("DonationsHistory")}
              >
                <LinearGradient
                  style={styles.gradientStyle}
                  colors={["#43e97b", "#458E59"]} // Light Green to Aqua
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <RankIcons size={40} rank={user.topDonorRank} />

                  <BalanceItem
                    value={`${user.totalDonatedAmount?.toFixed(2)} ${
                      process.env.APP_CURRENCY_NAME
                    }`}
                    label="المبلغ المتبرع به"
                  />
                </LinearGradient>
              </TouchableOpacity>
              <LinearGradient
                style={styles.gradientStyle}
                colors={["#00BCD4", "#458E59"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Image
                  style={{ width: 70, height: 70 }}
                  source={require("../../assets/icons/Frame208.png")}
                />
                <Text color={theme.white} type="sm">
                  {user.ambassadorRank} #
                </Text>
              </LinearGradient>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("CharingDonationHistory", {
                    donationType: "charging-account",
                  })
                }
              >
                <LinearGradient
                  style={styles.gradientStyle}
                  colors={["#00BCD4", "#458E59"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 1.5, y: 1 }}
                >
                  <BalanceItem
                    value={`${user.currentBalance?.toFixed(2)} ${
                      process.env.APP_CURRENCY_NAME
                    }`}
                    label="الرصيد الحالي"
                  />
                </LinearGradient>
              </TouchableOpacity>
              <LinearGradient
                style={styles.gradientStyle}
                colors={["#00c6ff", "#458E59"]} // Light Blue to Dark Blue
                start={{ x: 0, y: 0 }}
                end={{ x: 1.1, y: 0 }}
              >
                <BalanceItem
                  withIcon={false}
                  value={user.numberOfDonations}
                  label="عدد التبرعات"
                />
              </LinearGradient>
            </View>
          </>
        )}

        <View style={styles.navigationContainer}>
          <NavItem
            Icon={AntDesign}
            iconName="exclamationcircle"
            label="عن عطاء"
            onPress={() => navigation.navigate("AboutAtaa")}
          />
          <NavItem
            Icon={Fontisto}
            iconName="direction-sign"
            label="دليل التطبيق"
            color={"#05790A"}
            onPress={() => navigation.navigate("AppGuide")}
          />
          <NavItem
            Icon={MaterialIcons}
            iconName="contact-support"
            label="تواصل معنا"
            color={"#5F06F1"}
            onPress={() => navigation.navigate("ContactUsScreen")}
          />
          <CollapsibleItem
            style={{ padding: 10 }}
            label="التعليقات والمساعدة"
            collapsed={collapsed}
            onPress={toggleCollapse}
          >
            <SubNavItem
              Icon={MaterialCommunityIcons}
              iconName="frequently-asked-questions"
              label="الأسئلة الشائعة"
              onPress={() => navigation.navigate("CommonQuestions")}
            />
            <SubNavItem
              Icon={MaterialCommunityIcons}
              iconName="book-open-variant"
              label="سياسة الخصوصية"
              onPress={() => navigation.navigate("PrivacyPolicy")}
            />
          </CollapsibleItem>
          <NavItem
            Icon={Feather}
            iconName="bookmark"
            label="الفرص المحفوظة"
            onPress={() => navigation.navigate("SavedOpportunities")}
          />
          {isLoggedIn && (
            <>
              <NavItem
                onPress={logout}
                Icon={Feather}
                iconName="log-out"
                label="تسجيل الخروج"
              />
            </>
          )}
        </View>
        {!isLoggedIn && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("LoginFirstPage");
              closeDrawer();
            }}
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              backgroundColor: theme.buttonSecondary,
              padding: 10,
              width: "100%",
              borderRadius: 10,
            }}
          >
            <MaterialCommunityIcons
              name="login"
              size={24}
              color={theme.white}
            />
            <Text
              style={{
                color: theme.white,
              }}
              type="bodyTextSmall"
            >
              تسجيل الدخول
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  );
};

const Avatar = ({ image }) => (
  <Image
    style={styles.avatar}
    source={image ? image : require("../../assets/images/charityday.jpg")}
  />
);

const BalanceItem = ({ value, label, withIcon = true }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.balanceItem}>
      <Text color={theme.white} type="sm">
        {value}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        {withIcon && (
          <Icon.AntDesign name="leftcircle" size={10} color={theme.white} />
        )}
        <Text color={theme.white} type="xs">
          {label}
        </Text>
      </View>
    </View>
  );
};

const NavItem = ({ Icon, iconName, label, color, onPress }) => {
  const { theme } = useTheme();
  const { closeDrawer } = useIsDrawerOpen();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        closeDrawer();
      }}
      style={styles.navigationItem}
    >
      <Icon name={iconName} size={24} color={color || theme.secondaryColor} />
      <Text type="bodyTextSmall">{label}</Text>
    </TouchableOpacity>
  );
};

const SubNavItem = ({ Icon, iconName, label, onPress }) => {
  const { theme } = useTheme();
  const { closeDrawer } = useIsDrawerOpen();

  return (
    <TouchableOpacity
      onPress={() => {
        onPress();
        closeDrawer();
      }}
      style={[
        styles.navigationItem,
        { backgroundColor: theme.mangoBlack, borderRadius: 10 },
      ]}
    >
      <Icon name={iconName} size={24} color={theme.textColor} />
      <Text type="bodyTextSmall">{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  textContainer: { alignItems: "flex-end", justifyContent: "space-evenly" },
  textWithIcon: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 75, height: 75, borderRadius: 50 },
  balanceContainer: {
    borderRadius: 10,
    gap: 20,
    padding: 20,
    flexWrap: "wrap",
  },
  balanceItem: { alignItems: "center", gap: 5 },
  navigationContainer: { marginTop: 20 },
  navigationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  gradientStyle: {
    flexGrow: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DrawerContent;
