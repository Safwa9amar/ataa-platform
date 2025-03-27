import { Alert, Image, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Icon from "../../components/Icon";
import CustomScreenHeader from "../../components/CustomScreenHeader";
import adahiScreenImg from "../../assets/images/image35.png";
import newDamandImg from "../../assets/images/image36.png";
import Text from "../../components/Text";
import ScreensContainer from "../../components/ScreensContainer";
import CampaignsCard from "../../components/CampaignsCard";
export default function AdahiScreen({ navigation }) {
  const { theme } = useTheme();
  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader
          icon={
            <Icon.MaterialCommunityIcons
              name="sheep"
              size={20}
              color={theme.textColor}
            />
          }
          navigation={navigation}
          label="الاضاحي"
        />
      ),
    });
  }, [navigation]);
  return (
    <ScreensContainer
      style={{
        padding: 10,
        gap: 15,
      }}
    >
      <Image
        source={adahiScreenImg}
        style={{ width: "100%", height: 225, borderRadius: 10 }}
      />
      <Text
        style={{
          textAlign: "center",
          marginVertical: 20,
          color: theme.textColor,
        }}
        type="md"
      >
        برنامج لتوكيل جمع الأضاحي و العقيقة و الصدقة والعيد وتوزيعها كاملة على
        مستحقيها
      </Text>
      <CampaignsCard
        MaterialIcons
        iconName={"add-box"}
        label={"طلب جديد"}
        description={"أنشىء طلب أضاحي جديد"}
        image={newDamandImg}
        onPress={() => Alert.alert("قيد التطوير")}
      />
      <CampaignsCard
        onPress={() => Alert.alert("قيد التطوير")}
        MaterialIcons
        iconName={"playlist-add-check-circle"}
        label={"متابعة طلب سابق"}
        description={"متابعة الطلبات التي قمت بإنشائها)"}
        image={newDamandImg}
      />
    </ScreensContainer>
  );
}
