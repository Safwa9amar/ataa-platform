import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useCredentials } from "../../context/CredentialsContext";
import CustomScreenHeader from "../../components/CustomScreenHeader";
import { useHideNavbar } from "../../context/NavbarVisibilityContext";
import PrimaryBtn from "../../components/PrimaryBtn";
import { InputWithFloatingLabel } from "../../components/InputWithFloatingLabel";
import Icon from "../../components/Icon";
import { launchImageLibrary } from "react-native-image-picker";
import CustomDropDown from "../../components/CustomDropDown";
import LabelContainer from "../../components/ButtonWithLabel";
import AlertMessage from "../../components/AlertMessage";
import API_ENDPOINTS from "../../config/config";

export default function ProfileScreen({ navigation }) {
  const { loading, user, updateUser } = useCredentials();

  const { setHideNavbar } = useHideNavbar();
  const [imageUri, setImageUri] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isVisible, setIsVisible] = useState(user?.isVisible);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.error) {
        const source = response.assets[0];
        setImageUri(source.uri);
      }
    });
  };

  const validateForm = () => {
    if (
      editedUser.password &&
      editedUser.password !== editedUser.confirmPassword
    ) {
      setAlert({ type: "error", message: "Passwords do not match" });
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    if (!validateForm()) return;

    const formData = new FormData();

    // Append updated fields
    Object.entries(editedUser).forEach(([key, value]) => {
      if (value && key !== "confirmPassword") {
        formData.append(key, value);
      }
    });

    // Append visibility status
    formData.append("isVisible", isVisible);

    // Append new image if selected
    if (imageUri) {
      formData.append("file", {
        uri: imageUri,
        name: `profile_${user.id}.jpg`,
        type: "image/jpeg",
      });
      console.log(formData);
    }
    await updateUser(formData);
  };

  React.useLayoutEffect(() => {
    setHideNavbar(true);
    navigation.setOptions({
      header: () => (
        <CustomScreenHeader label={"حسابي"} navigation={navigation} />
      ),
    });
    return () => setHideNavbar(false);
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={-35}
      style={{ flex: 1, padding: 20 }}
    >
      <TouchableOpacity onPress={selectImage}>
        <Image
          style={{
            width: 150,
            height: 150,
            alignSelf: "center",
            marginBottom: 20,
            borderRadius: 75,
          }}
          source={{
            uri: imageUri || `${API_ENDPOINTS.UPLOADS}/${user?.photo}`,
          }}
        />
      </TouchableOpacity>

      {Object.entries(editedUser)
        .filter(([key]) => key !== "photo" && key !== "confirmPassword")
        .map(([key, value], index) => (
          <InputWithFloatingLabel
            key={index}
            label={
              key === "name"
                ? "الاسم"
                : key === "phone"
                ? "رقم الهاتف"
                : key === "email"
                ? "البريد الإلكتروني"
                : key === "password"
                ? "كلمة المرور الجديدة"
                : ""
            }
            icon={
              <Icon.Entypo
                name={key.includes("password") ? "lock" : "user"}
                size={20}
                color="grey"
              />
            }
            value={value}
            onChangeText={(text) => handleInputChange(key, text)}
            secureTextEntry={key.includes("password")}
          />
        ))}

      <InputWithFloatingLabel
        label="تأكيد كلمة المرور"
        icon={<Icon.Entypo name="lock" size={20} color="grey" />}
        value={editedUser.confirmPassword}
        onChangeText={(text) => handleInputChange("confirmPassword", text)}
        secureTextEntry
      />

      <LabelContainer textSize="sm" width="95%" label="خاصية كبار المحسنين">
        <CustomDropDown
          data={[
            { id: 1, ar_name: "عرض", isVisible: 1 },
            { id: 0, ar_name: "اخفاء", isVisible: 0 },
          ]}
          valueField="isVisible"
          labelField="ar_name"
          value={isVisible ? 1 : 0}
          handleChanges={(value) => setIsVisible(value.isVisible)}
        />
      </LabelContainer>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {alert && <AlertMessage type={alert.type} message={alert.message} />}

      <PrimaryBtn
        title="حفظ التغييرات"
        onPress={handleSaveChanges}
        disabled={loading}
      />
    </KeyboardAvoidingView>
  );
}
