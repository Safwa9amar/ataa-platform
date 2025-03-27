import { View, Image } from "react-native";
import React, { useLayoutEffect } from "react";
import CustomScreenHeader from "../../../components/CustomScreenHeader";
import { useTheme } from "../../../context/ThemeContext";
import CampaignsImg from "../../../assets/images/Campaigns.png";
import createCampaignImg from "../../../assets/images/Mobile_arketing-bro.png";
import completedCampaignImg from "../../../assets/images/7b4cb425de2d-newsstory1178x589.png";
import MyCampaignImg from "../../../assets/images/BusinessPlan.png";
import usersCampagn from "../../../assets/images/usersCampagn.jpg";
import Text from "../../../components/Text";
import ScreensContainer from "../../../components/ScreensContainer";
import CampaignsCard from "../../../components/CampaignsCard";
import CircularProgress from "react-native-circular-progress-indicator";
import Icon from "../../../components/Icon";
export default function Campagnes({ navigation }) {
  
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
          navigation.navigate("CreateCampagnScreen", {
            type: "donation-campaign",
          })
        }
        item={{
          iconName: "add",
          Ionicons: true,
        }}
        label={"إنشاء حملة"}
        description={"أنشى حملة وإبدأ يصنع أثر"}
        image={createCampaignImg}
      />

      <CampaignsCard
        onPress={() => navigation.navigate("MyCampagns")}
        item={{
          iconName: "megaphone",
          Ionicons: true,
        }}
        label={"حملاتي"}
        description={"الحملات التي قمت بإنشائها"}
        image={MyCampaignImg}
      />
      <CampaignsCard
        onPress={() => navigation.navigate("UsersCampagn")}
        item={{
          iconName: "people",
          Ionicons: true,
        }}
        label={"حملات المستخدمين"}
        description={"الحملات التي قام بإنشائها المستخدمين على منصة عطاء"}
        image={usersCampagn}
      />
      <CampaignsCard
        onPress={() => navigation.navigate("CompletedCampagnDonation")}
        item={{
          iconName: "checkmark-circle",
          Ionicons: true,
        }}
        label={"حملاتي المكتملة"}
        description={"الحملات التي تم جمع المبلغ المطلوب لها"}
        image={completedCampaignImg}
      />
    </ScreensContainer>
  );
}
