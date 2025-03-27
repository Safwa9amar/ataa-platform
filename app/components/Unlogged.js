import { View, Image } from "react-native";
import React from "react";
import Text from "./Text";
import ScreensContainer from "./ScreensContainer";
import PrimaryBtn from "./PrimaryBtn";
import ContactDivider from "./ContactDivider";
import SecondaryBtn from "./SecondaryBtn";

export default function Unlogged({ navigation, comeFrom }) {
  return (
    <ScreensContainer>
      <Image
        style={{
          width: "100%",
          height: 300,
          alignSelf: "center",
          marginVertical: 20,
        }}
        source={require("../assets/images/notlogin.png")}
      />
      <Text center type="md">
        يرجى تسجيل الدخول او انشاء حساب على منصة عطاء للوصول إلى هذه الصفحة
      </Text>
      <PrimaryBtn
        onPress={() => navigation.navigate("Login", { screen: "LoginForm", comeFrom })}
        title={"تسجيل الدخول"}
      />
      <ContactDivider label={"أو"} />
      <SecondaryBtn
        onPress={() => navigation.navigate("Login", { screen: "SignUpForm", comeFrom})}
        title={"إنشاء حساب"}
      />
    </ScreensContainer>
  );
}
