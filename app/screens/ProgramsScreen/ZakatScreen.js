import { View, Image } from "react-native";
import React, { useLayoutEffect } from "react";
import CustomScreenHeader from "../../components/CustomScreenHeader";
import { useTheme } from "../../context/ThemeContext";
import zakatScreenImg from "../../assets/images/zakatScreen.png";
import zakatImg from "../../assets/images/image30.png";
import zakatCalculatImg from "../../assets/images/image33.png";
import Text from "../../components/Text";
import ScreensContainer from "../../components/ScreensContainer";
import CampaignsCard from "../../components/CampaignsCard";
import ModelWrapper from "../../components/ModelWrapper";
import DirectZakatModal from "../../modal/DirectZakatModal";
import RapportModal from "../../modal/RapportModal";
import { Button } from "../../components/ButtonWithLabel";
import API_ENDPOINTS from "../../config/config";
import { useCredentials } from "../../context/CredentialsContext";
export default function ZakatScreen({ navigation }) {
  const { isLoggedIn } = useCredentials();
  const { isDarkMode, theme } = useTheme();
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const [amount, setAmount] = React.useState(0);
  const openModel = () => {
    setIsModelOpen(true);
  };
  const closeModel = () => {
    setIsModelOpen(false);
  };
  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <CustomScreenHeader
          icon={
            <Image
              source={require("../../assets/images/zakatBox.png")}
              style={{ width: 50, height: 50 }}
            />
          }
          navigation={navigation}
          label="الزكاة"
        />
      ),
    });
  }, [navigation, isDarkMode]);
  return (
    <ScreensContainer
      style={{
        padding: 10,
        gap: 15,
      }}
    >
      <Image
        source={zakatScreenImg}
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
        برنامج يتيح لك إمكانية حساب الزكاة بأنواعها المختلفة ودفعها عبر طرق سهلة
        و سريعة لتصل إلى مستحقيها
      </Text>
      {/* //TODO add ikhraj zakat screen to button bellow  */}
      <CampaignsCard
        FontAwesome5
        iconName={"coins"}
        label={"إخراج الزكاة"}
        description={"دفع مبلغ الزكاة المعلوم مباشرة"}
        image={zakatImg}
        onPress={() => {
          openModel();
        }}
      />
      <CampaignsCard
        onPress={() => {
          navigation.navigate("ZakatCalculatorScreen");
        }}
        FontAwesome5
        iconName={"calculator"}
        label={"حاسبة الزكاة"}
        description={"معرفة مقدار الزكاة الواجبة ثم دفعها مباشرة"}
        image={zakatCalculatImg}
      />

      <ModelWrapper isModelOpen={isModelOpen} closeModel={closeModel}>
        <DirectZakatModal
          closeModel={closeModel}
          setAmount={setAmount}
          amount={amount}
        />
      </ModelWrapper>
    </ScreensContainer>
  );
}
