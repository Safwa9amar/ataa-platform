import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Text from "../../components/Text";
import { useTheme } from "../../context/ThemeContext";
import { InputField } from "../ContactUsScreen";
import { CheckBoxLabled } from "../../components/CheckBox";
import { styles } from "./styles";
import GoogleSignBtn from "../../components/GoogleSign";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import API_ENDPOINTS from "../../config/config";
import validator from "validator";
import AlertMessage from "../../components/AlertMessage";

import { Platform } from "react-native";
import { useCredentials } from "../../context/CredentialsContext";

let LinearGradient;
if (Platform.OS !== "web") {
  LinearGradient = require("react-native-linear-gradient").default;
} else {
  // Use a web-specific alternative or a simple fallback
  LinearGradient = ({ children, style }) => <div style={style}>{children}</div>;
}

export const SignUpForm = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { loading, setLoading } = useCredentials();
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const timerRef = React.useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState({
    type: "",
    message: "",
  });

  const handleChange = React.useCallback((name, value) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }, []);

  const handleSignUp = async () => {
    if (
      validator.isEmpty(form.name) ||
      validator.isEmpty(form.email) ||
      validator.isEmpty(form.phone)
    ) {
      return setMessage({
        type: "info",
        message: "الرجاء تعبئة جميع الحقول",
      });
    }
    if (validator.isEmpty(form.name))
      return setMessage({
        type: "error",
        message: "الاسم الكامل مطلوب",
      });

    if (!validator.isEmail(form.email))
      return setMessage({
        type: "error",
        message: "البريد الالكتروني غير صحيح",
      });
    if (!validator.isMobilePhone(form.phone, "ar-DZ"))
      return setMessage({
        type: "error",
        message: "رقم الهاتف غير صحيح",
      });
    if (!privacyChecked)
      return setMessage({
        type: "info",
        message: "يرجى قبول الشروط والأحكام",
      });

    try {
      const response = await axios.post(API_ENDPOINTS.AUTH.SIGNUP, form);
      if (response.status === 201) {
        setMessage({ type: "success", message: "تم التسجيل بنجاح" });
        timerRef.current = setTimeout(() => {
          navigation.navigate("ChackCode", { email: form.email });
        }, 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ ما، حاول مرة أخرى.";
      setMessage({ type: "error", message: errorMessage });
    } finally {
      setLoading(false); // Ensure loading is turned off in both success and failure
    }
  };
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <View style={{ ...styles.inputContainer, gap: 5 }}>
      <InputField
        iconSize={20}
        placeholder="الاسم الكامل"
        icon="user"
        color={theme.steel}
        onChangeText={(text) => handleChange("name", text)}
        value={form.name}
      />

      <InputField
        textContentType="emailAddress"
        iconSize={20}
        placeholder="البريد الالكتروني"
        icon="mail"
        color={theme.steel}
        onChangeText={(text) => handleChange("email", text)}
        value={form.email}
      />

      <InputField
        textContentType="telephoneNumber"
        keyboardType="phone-pad"
        iconSize={20}
        placeholder="رقم الهاتف"
        icon="mobile1"
        color={theme.steel}
        onChangeText={(text) => handleChange("phone", text)}
        value={form.phone}
      />

      <CheckBoxLabled
        type="sm"
        label="أوافق على سياسة الخصوصية والشروط والأحكام"
        checked={privacyChecked}
        onPress={() => setPrivacyChecked(!privacyChecked)}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color={theme.primary}
          style={{ marginTop: 20 }}
        />
      )}
      {message.message && (
        <AlertMessage
          onClose={() => setMessage({ type: "", message: null })}
          type={message.type}
          message={message.message}
        />
      )}
      <TouchableOpacity onPress={handleSignUp}>
        <LinearGradient
          colors={["#22C6CB", "#01E441"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>متابعة</Text>
        </LinearGradient>
      </TouchableOpacity>
      <GoogleSignBtn />
    </View>
  );
};
