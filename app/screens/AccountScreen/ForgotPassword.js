import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { InputField } from "../ContactUsScreen";
import { styles } from "./styles";
import PrimaryBtn from "../../components/PrimaryBtn";
import axios from "axios";
import API_ENDPOINTS from "../../config/config";
import AlertMessage from "../../components/AlertMessage";
import validator from "validator"; // Importing validator

export function ForgotPassword({ navigation }) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", message: "" }); // State for AlertMessage

  const handleEmailChange = (email) => {
    setEmail(email);
  };

  const handleLogin = async () => {
    if (!validator.isEmail(email)) {
      setMessage({ type: "error", message: "البريد الإلكتروني غير صحيح" });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      if (response.status === 200) {
        navigation.navigate("ResetPassword", { email });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.";
      setMessage({ type: "error", message: errorMessage });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
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
      />

      {loading && (
        <ActivityIndicator
          animating={loading}
          color={theme.buttonPrimary}
          size="large"
        />
      )}

      <PrimaryBtn disabled={loading} onPress={handleLogin} title="استعادة" />
    </View>
  );
}
