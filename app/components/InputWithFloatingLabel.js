import { View } from "react-native";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { TextInput } from "react-native";
import Text from "./Text";
import Icon from "./Icon";
import validator from "validator";

export const InputWithFloatingLabel = ({
  type = "string",
  label,
  icon = <Icon.FontAwesome5 name="user-edit" size={20} color="grey" />,
  ...props
}) => {
  const { theme } = useTheme();
  const [isValid, setIsValid] = React.useState(true);
  const [message, setMessage] = React.useState("");

  return (
    <View style={{ margin: 10 }}>
      <Text
        type="sm"
        style={{
          marginBottom: 5,
          paddingHorizontal: 15,
          color: isValid ? "grey" : theme.errorColor,
          position: "absolute",
          top: -10,
          right: 10,
          zIndex: 10,
          borderRadius: 5,
          backgroundColor: theme.backgroundColor,
        }}
      >
        {label} {isValid ? "" : `(${message})`}
      </Text>
      <TextInput
        {...props}
        placeholderTextColor={theme.secondaryTextColor}
        onChangeText={(text) => {
          switch (type) {
            case "email":
              setIsValid(validator.isEmail(text));
              setMessage("الرجاء إدخال بريد إلكتروني صحيح");
              break;
            case "password":
              setIsValid(validator.isStrongPassword(text));
              break;
            case "phone":
              setIsValid(validator.isMobilePhone(text, "ar-DZ"));
              setMessage("الرجاء إدخال رقم هاتف صحيح");
              break;
            case "NIN":
              setIsValid(
                validator.isNumeric(text) &&
                  validator.isLength(text, { min: 18, max: 18 })
              );
              setMessage("الرجاء إدخال رقم هوية صحيح");
              break;
            case "description":
              setIsValid(validator.isLength(text, { min: 10, max: 1500 }));
              setMessage("الرجاء إدخال وصف بين 10 و 1500 حرف");
              break;
            case "title":
              setIsValid(validator.isLength(text, { min: 5, max: 50 }));
              setMessage("الرجاء إدخال عنوان بين 5 و 50 حرف");
              break;
            case "bank":
              setIsValid(validator.isLength(text, { min: 5, max: 23 }));
              setMessage(" ما بين 5 و 23 رقم ");
              break;
            case "url":
              setIsValid(validator.isURL(text));
              setMessage("الرجاء إدخال رابط صحيح");
              break;
            default:
              setIsValid(true);
              break;
          }
          props.onChangeText(text);
        }}
        style={{
          color: theme.textColor,
          borderWidth: 1,
          borderRadius: 10,
          padding: 5,
          paddingHorizontal: 10,
          borderColor: isValid ? "grey" : theme.errorColor,
          textAlign: "right",
        }}
      />
      <View style={{ position: "absolute", top: 10, left: 10 }}>{icon}</View>
    </View>
  );
};
