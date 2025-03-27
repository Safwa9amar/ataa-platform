import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Text from "../../components/Text";
import { useTheme } from "../../context/ThemeContext";
import { InputField } from "../ContactUsScreen";
import { styles } from "./styles";
import { CheckBoxLabled } from "../../components/CheckBox";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import axios from "axios";
import API_ENDPOINTS from "../../config/config";
import { useCredentials } from "../../context/CredentialsContext";
import PrimaryBtn from "../../components/PrimaryBtn";
import AlertMessage from "../../components/AlertMessage";
import validator from "validator"; // Importing validator

export const ResetPassword = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resendVerification, setResendVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" }); // State for AlertMessage
  const { login, saveLogin, setSaveLogin } = useCredentials();

  const { email } = route.params;
  const { toggleNavbar } = useHideNavbar();

  const handleSaveLogin = () => {
    setSaveLogin(!saveLogin);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleVerification = async () => {
    if (!verificationCode || !password || !confirmPassword) {
      setMessage({ type: "error", message: "الرجاء تعبئة جميع الحقول" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", message: "كلمتا المرور غير متطابقتين" });
      return;
    }

    if (!validator.isStrongPassword(password, { minLength: 8 })) {
      setMessage({
        type: "error",
        message:
          "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل وتتضمن أرقام وحروف خاصة.",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        email,
        verificationCode,
        password,
        rememberMe: saveLogin,
      });

      if (response.status === 200) {
        setMessage({ type: "success", message: "تم تغيير كلمة المرور بنجاح" });
        toggleNavbar();
        console.log(response.data.token);
        login(response.data.token);
        navigation.navigate("Home");
      }
    } catch (error) {
      if (error.response.data.action === "resend") setResendVerification(true);
      setMessage({ type: "error", message: error.response.data.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
        rememberMe: saveLogin,
      });
      if (response.status === 200) {
        setMessage({ type: "success", message: "تم إرسال رمز التحقق بنجاح" });
      }
    } catch (error) {
      setMessage({ type: "error", message: error.response.data.message });
    } finally {
      setLoading(false);
    }
  };

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
        onPress={handleSaveLogin}
      />

      {resendVerification && (
        <Text type="md" style={{ color: theme.red, textAlign: "center" }}>
          لم يتم إرسال رمز التحقق؟{" "}
          <Text
            type="md"
            style={{ color: theme.primaryColor }}
            onPress={handleResendVerification}
          >
            إعادة إرسال
          </Text>
        </Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={theme.primaryColor} />
      ) : null}

      <PrimaryBtn onPress={handleVerification} title="استعادة" />
    </View>
  );
};
