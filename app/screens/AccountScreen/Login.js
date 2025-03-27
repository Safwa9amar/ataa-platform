import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, SafeAreaView, Image } from "react-native";

import Text from "../../components/Text";
import WaveSvg from "../../assets/vectors/WavesSvg";
import { useTheme } from "../../context/ThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { KeyboardAvoidingView } from "react-native";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { ChackCode } from "./ChackCode";
import { styles } from "./styles";
import { useCredentials } from "../../context/CredentialsContext";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import { ForgotPassword } from "./ForgotPassword";
import { ResetPassword } from "./ResetPassword";

const Tabs = createNativeStackNavigator();
const Login = ({ route, navigation }) => {
  const comeFrom = route ? route?.params?.comeFrom : null;
  const [currentScreen, setCurrentScreen] = useState("LoginFirstPage");
  const { theme } = useTheme();
  const { isLoggedIn } = useCredentials();
  const { setHideNavbar } = useHideNavbar();

  useEffect(() => {
    if (comeFrom && isLoggedIn) {
      navigation.navigate(comeFrom);
    } else {
      isLoggedIn && navigation.navigate("Home");
    }
    !isLoggedIn && setHideNavbar(true);
    return () => setHideNavbar(false);
  }, [isLoggedIn]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      behavior="height"
      keyboardVerticalOffset={30}
    >
      <Image
        // sharedTransitionTag="tag"
        style={{ width: 150, height: 150, marginBottom: 20 }}
        source={require("../../assets/logo/logoWithCircle.png")}
      />
      <Text>مرحبا بعودتك</Text>
      {currentScreen === "ChackCode" ? (
        <Text
          type="md"
          style={{
            color: theme.steel,
            margin: 10,
            width: 200,
            textAlign: "center",
          }}
        >
          ستصلك رسالة رمز التحقق على بريدك الالكتروني
        </Text>
      ) : (
        <Text style={{ color: theme.steel }}>انت على وشك احداث التغيير</Text>
      )}

      {/* Login form */}
      <View style={{ ...styles.formContainer, borderColor: theme.steel }}>
        <SafeAreaView
          style={{
            height: currentScreen === "ForgotPassword" ? 200 : 400,
            overflow: "hidden",
          }}
        >
          <Tabs.Navigator
            initialRouteName={route.params?.screen || "LoginForm"}
            screenListeners={({ route }) => {
              return {
                focus: () => {
                  setCurrentScreen(route.name);
                },
              };
            }}
            screenOptions={{
              contentStyle: {
                backgroundColor: "transparent",
              },
              animation: "fade",
              header: () =>
                currentScreen !== "ForgotPassword" && (
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("SignUpForm")}
                    >
                      <Text
                        type="md"
                        style={{
                          color:
                            currentScreen === "SignUpForm"
                              ? theme.buttonPrimary
                              : null,
                        }}
                      >
                        انشاء حساب
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("LoginForm")}
                    >
                      <Text
                        type="md"
                        style={{
                          color:
                            currentScreen === "LoginForm"
                              ? theme.buttonPrimary
                              : null,
                        }}
                      >
                        تسجيل الدخول
                      </Text>
                    </TouchableOpacity>
                  </View>
                ),
            }}
          >
            <Tabs.Screen name="LoginForm" component={LoginForm} />
            <Tabs.Screen name="SignUpForm" component={SignUpForm} />
            <Tabs.Screen name="ChackCode" component={ChackCode} />
            <Tabs.Screen name="ForgotPassword" component={ForgotPassword} />
            <Tabs.Screen name="ResetPassword" component={ResetPassword} />
          </Tabs.Navigator>
        </SafeAreaView>
      </View>

      {/* Wave background */}
      <View
        style={{
          position: "absolute",
          zIndex: -100,
          bottom: 0,
          width: "100%",
        }}
      >
        <WaveSvg />
      </View>
      {/* </ScrollView> */}
    </KeyboardAvoidingView>
  );
};

export default Login;
