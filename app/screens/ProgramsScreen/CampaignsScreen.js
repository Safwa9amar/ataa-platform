import { View, Image } from "react-native";
import React, { useLayoutEffect } from "react";
import CustomScreenHeader from "../../components/CustomScreenHeader";
import Icon from "../../components/Icon";
import { useTheme } from "../../context/ThemeContext";
import CampaignsImg from "../../assets/images/Campaigns.png";
import createCampaignImg from "../../assets/images/Mobile_arketing-bro.png";
import completedCampaignImg from "../../assets/images/7b4cb425de2d-newsstory1178x589.png";
import MyCampaignImg from "../../assets/images/BusinessPlan.png";
import Text from "../../components/Text";
import ScreensContainer from "../../components/ScreensContainer";
import CampaignsCard from "../../components/CampaignsCard";
import CircularProgress from "react-native-circular-progress-indicator";
export default function Campaigns({ navigation }) {
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
            <Icon.Ionicons name="megaphone" size={20} color={theme.textColor} />
          }
          navigation={navigation}
          label="الحملات"
        />
      ),
    });
  }, []);
  return (
    <ScreensContainer
      style={{
        padding: 10,
        gap: 15,
      }}
    >
      <Image
        source={CampaignsImg}
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
        المساهمة مع منصة عطاء في جمع التبرعات للمجالات الخيرية المختلفة لتشارك
        في تحقيق التعاون و التكافل وتترك أثر ذا بصمة طيبة في حياة الآخرين
      </Text>
      <CampaignsCard
        onPress={() =>
          navigation.navigate("CreateCampaignScreen", {
            type: "donation-campaign",
          })
        }
        iconName={"megaphone"}
        Ionicons
        label={"إنشاء حملة"}
        description={"أنشى حملة وإبدأ يصنع أثر"}
        image={createCampaignImg}
      />
      <CampaignsCard
        onPress={() => navigation.navigate("CompletedCampaignDonation")}
        iconName={"megaphone"}
        Ionicons
        label={"حملاتي المكتملة"}
        description={"الحملات التي تم جمع المبلغ المطلوب لها"}
        image={completedCampaignImg}
      />
      <CampaignsCard
        iconName={"megaphone"}
        Ionicons
        label={"حملاتي"}
        description={"الحملات التي قمت بإنشائها"}
        image={MyCampaignImg}
      />
      <Text type="md">
        الحملات المميزة , أكثر الحملات زيارة وتبرعا في الفترة الأخيرة
      </Text>
      <CampaignsCard
        iconName={"megaphone"}
        Ionicons
        label={"خانة العنوان"}
        description={"المبلغ المتبقي 1000 دج "}
      >
        <CircularProgress
          value={30}
          radius={30}
          duration={1000}
          activeStrokeColor={"#F75178"}
          activeStrokeWidth={5}
          valueSuffix={"%"}
          titleColor={"#eee"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </CampaignsCard>
      <CampaignsCard
        iconName={"megaphone"}
        Ionicons
        label={"خانة العنوان"}
        description={"المبلغ المتبقي 1000 دج "}
      >
        <CircularProgress
          value={30}
          radius={30}
          duration={1000}
          activeStrokeColor={"#F75178"}
          activeStrokeWidth={5}
          valueSuffix={"%"}
          titleColor={"#eee"}
          titleStyle={{ fontWeight: "bold" }}
        />
      </CampaignsCard>
    </ScreensContainer>
  );
}
