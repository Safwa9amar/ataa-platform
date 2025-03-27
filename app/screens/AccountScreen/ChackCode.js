import React, { useEffect, useState, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Text from "../../components/Text";
import { useTheme } from "../../context/ThemeContext";
import { InputField } from "../ContactUsScreen";
import { styles } from "./styles";
import { CheckBoxLabled } from "../../components/CheckBox";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import axios from "axios";
import API_ENDPOINTS from "../../config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCredentials } from "../../context/CredentialsContext";
import AlertMessage from "../../components/AlertMessage"; // Import AlertMessage

import { Platform } from "react-native";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}

export const ChackCode = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", message: "" }); // State for AlertMessage
  const { login, saveLogin, setSaveLogin } = useCredentials();
  const { email } = route.params;
  const { toggleNavbar } = useHideNavbar();
  const timerRef = React.useRef(null);

  const handleShowPassword = useCallback(() => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }, []);

  const handleVerification = async () => {
    if (!verificationCode || !password || !confirmPassword) {
      return setMessage({ type: "error", message: "الرجاء تعبئة جميع الحقول" });
    }

    if (password !== confirmPassword) {
      return setMessage({
        type: "error",
        message: "كلمتا المرور غير متطابقتين",
      });
    }

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.VERIFY_SIGNUP, {
        email,
        verificationCode,
        password,
        rememberMe: saveLogin,

      });

      if (response.status === 200) {
        setMessage({ type: "success", message: "تم التحقق من المستخدم بنجاح" });
        toggleNavbar();
        login(response.data.token);
        timerRef.current = setTimeout(() => {
          navigation.navigate("Home");
        }, 3000); // Delayed navigation to allow user to read the success message
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.";
      setMessage({ type: "error", message: errorMessage });
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  useEffect(() => {
    return clearTimeout(timerRef.current);
  }, []);

  return (
    <View style={styles.inputContainer}>
      {message.message && (
        <AlertMessage
          onClose={() => setMessage({ type: "", message: "" })}
          type={message.type}
          message={message.message}
        />
      )}
      <InputField
        keyboardType="numeric"
        iconSize={20}
        placeholder="رمز التحقق"
        icon="key"
        color={theme.steel}
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <InputField
        secureTextEntry={!showPassword}
        fullIcon={
          <TouchableOpacity onPress={handleShowPassword}>
            <Entypo
              name={!showPassword ? "eye" : "eye-with-line"}
              size={20}
              color={theme.steel}
            />
          </TouchableOpacity>
        }
        iconSize={22}
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
      />
      <InputField
        secureTextEntry={!showPassword}
        fullIcon={
          <TouchableOpacity onPress={handleShowPassword}>
            <Entypo
              name={!showPassword ? "eye" : "eye-with-line"}
              size={20}
              color={theme.steel}
            />
          </TouchableOpacity>
        }
        iconSize={22}
        placeholder="تأكيد كلمة المرور"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <CheckBoxLabled
        label="حفظ بيانات الدخول"
        checked={saveLogin}
        onPress={() => setSaveLogin(!saveLogin)}
      />
      <TouchableOpacity style={styles.button} onPress={handleVerification}>
        <LinearGradient
          colors={["#22C6CB", "#01E441"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>متابعة</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};
