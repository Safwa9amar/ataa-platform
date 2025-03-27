import { Platform, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useCredentials } from "../context/CredentialsContext";
import { useTheme } from "../context/ThemeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import Text from "./Text";

let GoogleSigninButton =
  Platform.OS !== "web"
    ? require("@react-native-google-signin/google-signin").GoogleSigninButton : null
    // : require("@react-oauth/google").GoogleLogin;

export default function GoogleSignBtn() {
  const { loginWithGoogle } = useCredentials();
  const { theme } = useTheme();

  if (Platform.OS === "web") {
    return (
      <GoogleSigninButton
        onSuccess={(response) => {
          console.log(response);
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    );
  }

  return (
    <TouchableOpacity
      style={{
        ...styles.googleButton,
        borderColor: theme.buttonSecondary,
        borderWidth: 1,
      }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={loginWithGoogle}
      disabled={false}
    >
      <AntDesign name="google" size={24} color={theme.buttonSecondary} />
      <Text type="sm">تسجيل الدخول بحساب جوجل </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    width: 250,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignSelf: "center",
  },
});
