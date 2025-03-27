import React, { useEffect, useReducer, View } from "react";
import Icon from "../../../../components/Icon";
import { InputWithFloatingLabel } from "../../../../components/InputWithFloatingLabel";
import { useCredentials } from "../../../../context/CredentialsContext";
import { useTheme } from "../../../../context/ThemeContext";
import { useCreateCampaign } from "../../../../context/CreateCampaignContext";
import Text from "../../../../components/Text";
import ModelWrapper from "../../../../components/ModelWrapper";
import MarkdownGuide from "../../../../components/MarkdownGuide";
import { TouchableOpacity } from "react-native";
import ScreensContainer from "../../../../components/ScreensContainer";
import validator from "validator";

const Personal = ({ setPageStatus }) => {
  const { user } = useCredentials();
  const { theme } = useTheme();
  const { state, update, load } = useCreateCampaign();
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const closeModel = () => {
    setIsModelOpen(false);
  };
  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const { name, email, phone, description, title } = state;
    // Check personal information
    // console.log("state", { name, email, phone, description, title });
    const isValid =
      validator.isEmail(email) &&
      validator.isMobilePhone(phone, "ar-DZ") &&
      validator.isLength(name, { min: 3, max: 50 }) &&
      validator.isLength(title, { min: 5, max: 50 }) &&
      validator.isLength(description, { min: 10, max: 1500 });
    if (isValid) {
      setPageStatus("Personal", true);
    } else {
      setPageStatus("Personal", false);
    }
  }, [state]);

  return (
    <ScreensContainer
      style={{
        gap: 10,
      }}
    >
      <InputWithFloatingLabel
        onChangeText={(val) => update("name", val)}
        editable={true}
        icon={
          <Icon.Ionicons
            name="person"
            size={20}
            color={theme.secondaryTextColor}
          />
        }
        label={"الاسم الكامل"}
        value={state.name}
      />
      <InputWithFloatingLabel
        type="email"
        onChangeText={(val) => update("email", val)}
        editable={true}
        icon={
          <Icon.Ionicons
            name="mail"
            size={20}
            color={theme.secondaryTextColor}
          />
        }
        label={"البريد الالكتروني"}
        value={state.email}
      />
      <InputWithFloatingLabel
        type="phone"
        editable={true}
        icon={
          <Icon.Ionicons
            name="call"
            size={20}
            color={theme.secondaryTextColor}
          />
        }
        keyboardType={"phone-pad"}
        label={"رقم الهاتف"}
        value={state.phone}
        onChangeText={(val) => update("phone", val)}
      />
      <InputWithFloatingLabel
        type="title"
        icon={null}
        label={"عنوان الحملة"}
        value={state.title}
        onChangeText={(val) => update("title", val)}
      />
      {/* <View> */}
      <TouchableOpacity
        onPress={() => {
          setIsModelOpen(true);
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
          backgroundColor: theme.mangoBlack,
        }}
      >
        <Text color={theme.infoColor} center type="md">
          تدعم منصة عطاء خاصية Markdown لتنسيق النصوص، يمكنك الاطلاع على الدليل
          من هنا
        </Text>
        <Icon.Ionicons name="help-buoy" size={20} color={theme.infoColor} />
      </TouchableOpacity>
      <ModelWrapper isModelOpen={isModelOpen} closeModel={closeModel}>
        <MarkdownGuide />
      </ModelWrapper>
      <InputWithFloatingLabel
        type="description"
        numberOfLines={10}
        multiline
        icon={null}
        placeholder={"نص تعريف الحملة"}
        label={"تعريف الحملة"}
        value={state.description}
        onChangeText={(val) => update("description", val)}
      />
    </ScreensContainer>
  );
};

export default Personal;
