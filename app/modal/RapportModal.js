import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import Icon from "../components/Icon";
import TabItem from "../components/TabItem";
import Text from "../components/Text";
import { useTheme } from "../context/ThemeContext";
import { Button } from "../components/ButtonWithLabel";
import ContactDivider from "../components/ContactDivider";

import { useCredentials } from "../context/CredentialsContext";
import { useGetReport } from "../hooks/useGetReport";
import AlertMessage from "../components/AlertMessage";

const ButtonComponent = ({
  onPress,
  width,
  height,
  label,
  icon,
  bgColor,
  props,
}) => {
  return (
    <Button
      isActive
      onPress={onPress}
      width={width}
      height={height}
      label={label}
      icon={icon}
      bgColor={bgColor}
      {...props}
    />
  );
};

const TabItemComponent = ({ label, icon }) => {
  const { theme } = useTheme();
  return <TabItem reversed label={label} icon={icon} />;
};

const RapportModal = ({ data }) => {
  const { theme } = useTheme();
  const { userToken, isLoggedIn } = useCredentials();
  const { getReport, openRapport, progress, loading, error } = useGetReport(
    data.URI,
    data.name
  );

  const handleDownload = () => {
    if (loading) return console.log("loading");
    if (progress === 100) {
      return openRapport();
    }
    getReport(data.from, data.to, userToken);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/logo/fullLogo.png")}
        style={styles.logo}
      />
      <Text type="lg" style={styles.footerText(theme.textColor)}>
        "بعطائكم مؤمنون ولنشر الخير ثابتون"
      </Text>
      {error ? (
        <AlertMessage message={"حدث خطأ اثناء تحميل الملف"} type="error" />
      ) : !isLoggedIn ? (
        <AlertMessage message={"يجب تسجيل الدخول لتحميل الملف"} type="error" />
      ) : (
        <>
          <ButtonComponent
            onPress={handleDownload}
            width={200}
            height={40}
            label={progress === 100 ? "معاينة " : "تحميل " + data.name}
            icon={
              progress === null || progress === 100 ? (
                <Icon.FontAwesome5
                  color={theme.white}
                  name="download"
                  size={15}
                />
              ) : (
                <ActivityIndicator
                  animating={loading}
                  size={26}
                  color={theme.white}
                />
              )
            }
            bgColor={theme.BONKER_PINK}
          />

          {progress && progress !== 100 && (
            <Text type="md" style={styles.footerText(theme.textColor)}>
              {progress}%
            </Text>
          )}
        </>
      )}
      <ContactDivider label={"اتصل بنا عبر"} />
      <View style={styles.tabContainer}>
        <TabItemComponent
          label={process.env.SUPPORT_PHONE}
          icon={
            <Icon.Feather color={theme.textColor} name="phone-call" size={15} />
          }
        />
        <TabItemComponent
          label={process.env.WEBSITE_URL}
          icon={
            <Icon.MaterialCommunityIcons
              color={theme.textColor}
              name="web"
              size={15}
            />
          }
        />
        <TabItemComponent
          label={process.env.FACEBOOK_URL}
          icon={
            <Icon.FontAwesome
              color={theme.textColor}
              name="facebook"
              size={15}
            />
          }
        />
        <TabItemComponent
          label={process.env.INSTAGRAM_URL}
          icon={
            <Icon.AntDesign
              color={theme.textColor}
              name="instagram"
              size={15}
            />
          }
        />
        <TabItemComponent
          label={process.env.TIKTOK_URL}
          icon={
            <Icon.Ionicons
              color={theme.textColor}
              name="logo-tiktok"
              size={15}
            />
          }
        />
        <TabItemComponent
          label={process.env.SUPPORT_EMAIL}
          icon={
            <Icon.AntDesign color={theme.textColor} name="mail" size={15} />
          }
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 10,
  },
  collapsible: {
    gap: 10,
  },
  logo: {
    width: 250,
    height: 150,
  },
  footerText: (textColor) => ({
    color: textColor,
    textAlign: "center",
    fontFamily: "ReemKufi-Medium",
  }),
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
});

export default RapportModal;
