import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Text from "../../components/Text";
import { useTheme } from "../../context/ThemeContext";
import { InputField } from "../ContactUsScreen";
import { CheckBoxLabled } from "../../components/CheckBox";
import { styles } from "./styles";
import { useCredentials } from "../../context/CredentialsContext";
import PrimaryBtn from "../../components/PrimaryBtn";
import axios from "axios";
import API_ENDPOINTS from "../../config/config";
import AlertMessage from "../../components/AlertMessage";
import validator from "validator"; // Importing validator

import GoogleSignBtn from "../../components/GoogleSign";

export function LoginForm({ navigation }) {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", message: "" }); // State for AlertMessage
  const { loading, setLoading, checkAuthentication, saveLogin, setSaveLogin } =
    useCredentials();

  const handleSaveLogin = () => {
    setSaveLogin(!saveLogin);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (email) => {
    setEmail(email);
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
  };

  const handleLogin = async () => {
    if (!validator.isEmail(email)) {
      setMessage({ type: "error", message: "البريد الإلكتروني غير صحيح" });
      return;
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 8 })
    ) {
      setMessage({
        type: "error",
        message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
        rememberMe: saveLogin,
      });

      if (response.data.token) {
        checkAuthentication(response.data.token);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.";
      setMessage({ type: "error", message: errorMessage });
      if (error.response?.status === 403) {
        navigation.navigate("ChackCode", { email });
      }
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
        iconSize={20}
        placeholder="البريد الالكتروني"
        icon="mail"
        color={theme.steel}
        onChangeText={handleEmailChange}
        value={email} // Added value prop to maintain controlled input
        autoComplete={email.toString()}
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
        onChangeText={handlePasswordChange}
        value={password} // Added value prop to maintain controlled input
        autoComplete={password.toString()}

      />
      <CheckBoxLabled
        label="حفظ بيانات الدخول"
        checked={saveLogin}
        onPress={handleSaveLogin}
      />
      {loading && (
        <ActivityIndicator
          animating={loading}
          color={theme.buttonPrimary}
          size="large"
        />
      )}

      <PrimaryBtn onPress={handleLogin} title="تسجيل الدخول" />
      <GoogleSignBtn />
      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword", { email })}
        >
          <Text type="md" style={{ color: theme.buttonPrimary }}>
            استعادة
          </Text>
        </TouchableOpacity>
        <Text type="md"> هل نسيت كلمة المرور ؟ </Text>
      </View>
    </View>
  );
}
