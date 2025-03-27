import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Collapsible from "react-native-collapsible";
import TabButton from "../../components/FastDontion/TabButton";
import AmountButton from "../../components/FastDontion/AmountButton";
import BaridiTab from "../../components/FastDontion/BaridiTab";
import BaridiMobTab from "../../components/FastDontion/BaridiMobTab";
import CashTab from "../../components/FastDontion/CashTab";
import OtherTab from "../../components/FastDontion/Stripe";
import { shadowStyles } from "../../components/FastDontion/shadowStyles";
import Text from "../../components/Text";
import Icon from "../../components/Icon";
import PrimaryBtn from "../../components/PrimaryBtn";
import { useNavigation, useRoute } from "@react-navigation/native";
import AnimatedCampaignsCard from "../../components/CampaignsCard";
import ContactDivider from "../../components/ContactDivider";
import { useCredentials } from "../../context/CredentialsContext";
import { createDonation } from "../../services/donationService";
import AlertMessage from "../../components/AlertMessage";
import uploadFileService from "../../services/uploadFileService";
import { useDonationModalContext } from "../../context/DonationModalContext";
import { CONSTANTS } from "../../config/config";
import { useCart } from "../../context/CartContext";
import LabelContainer from "../../components/ButtonWithLabel";
import { Slider } from "@miblanchard/react-native-slider";
import calculateSponsorshipAmount from "../../utils/calculateOrphaneDonationAmount";

const DonateNowModal = () => {
  const { closeDonationModal } = useDonationModalContext();
  const route = useRoute();
  const navigation = useNavigation();
  const data = route.params?.donationData;
  // console.log(data);
  // return <Text>Donate Now Modal</Text>;
  const { theme } = useTheme();
  const { user, userToken, checkAuthentication, isLoggedIn } = useCredentials();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [recipientPhoto, setRecipientPhoto] = useState(null);
  const timer = useRef();
  const { clearCart } = useCart();
  const [disbaleDonateBtn, setDisableDonateBtn] = useState(false);
  const [state, setState] = useState({
    silderValue: 30,
    activeBtn: "مشاريع",
    activeAmount: data?.cartTotalAmount || 0,
    activeTab: "يوم",
  });

  const handleSliderChanges = useCallback(
    (val) => {
      let value = val[0].toFixed(0);
      setState((prevState) => ({
        ...prevState,
        activeAmount: calculateSponsorshipAmount(state.activeTab, value),
        silderValue: value,
      }));
    },
    [state.activeTab]
  );

  const handleSetActiveTab = (tab) => {
    setState((prevState) => ({ ...prevState, activeTab: tab }));
  };

  const handleInputChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      activeAmount: parseFloat(e.nativeEvent.text) || 0,
    }));
  };

  const tabContents = {
    Baridi: (
      <BaridiTab
        recipientPhoto={recipientPhoto}
        setRecipientPhoto={setRecipientPhoto}
      />
    ),
    BaridiMob: (
      <BaridiMobTab
        recipientPhoto={recipientPhoto}
        setRecipientPhoto={setRecipientPhoto}
      />
    ),
    Cash: <CashTab />,
    Stripe: <OtherTab />,
    SStripe: <OtherTab />,
  };

  const handleDonateNow = async () => {
    // CampaignType
    // unitPrice
    if (state.activeTab === "usePoints" && state.activeAmount === 0) {
      setAlert({
        msg: "الرجاء ادخال عدد النقاط الذي تريد تحويله",
        type: "error",
      });
      return;
    }
    if (state.activeAmount < 100) {
      setAlert({
        msg:
          state.activeAmount === 0
            ? "الرجاء اختيار مبلغ"
            : "الحد الأدنى للتبرع هو 100 دج",
        type: "error",
      });
      return;
    }

    if (!state.activeTab) {
      setAlert({
        msg: "الرجاء اختيار طريقة الدفع",
        type: "error",
      });
      return;
    }
    if (
      (state.activeTab === "Baridi" || state.activeTab === "BaridiMob") &&
      recipientPhoto === null
    ) {
      setAlert({
        msg: "الرجاء تحميل صورة الإيصال",
        type: "error",
      });
      return;
    }
    if (
      state.activeTab === "useBalance" &&
      state.activeAmount > user.currentBalance
    ) {
      setAlert({
        msg: "رصيدك الحالي غير كافي بمكنك شحن حسابك عل من هنا",
        type: "error",
        action: () => {
          navigation.navigate("CharingDonationHistory");
          closeDonationModal();
        },
      });
      return;
    }
    if (!isLoggedIn) {
      setAlert({
        msg: "الرجاء تسجيل الدخول او انشاء حساب حتى تتمكن من التبرع",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      let screenShoot =
        (state.activeTab === "Baridi" || state.activeTab === "BaridiMob") &&
        (await uploadFileService(recipientPhoto.assets));
      const res = await createDonation(
        {
          donationTypeID: data?.id, // Adjust based on the context
          donationType: data?.donationType, // Adjust based on the context
          amount: state.activeAmount,
          paymentMethod: state.activeTab,
          screenShoot: screenShoot,
          userId: user.id,
          cartData: data?.cartData,
        },
        userToken
      );
      if (res) {
        checkAuthentication(userToken);
        setAlert({
          msg: "تمت عملية التبرع بنجاح",
          type: "success",
        });
        setDisableDonateBtn(true);
        data.donationType === CONSTANTS.DONATION_TYPES.CART && clearCart();
        timer.current = setTimeout(() => {
          closeDonationModal();
        }, 3000);
        navigation.setParams({ refrech: true });
      }
    } catch (error) {
      console.error(error.message);
      setAlert({
        msg: "فشل التبرع، الرجاء المحاولة مرة اخرى",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);
  return (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={50}>
      <ScrollView contentContainerStyle={styles.container(theme.mangoBlack)}>
        <View style={styles.btnContainer}>
          {["السنة", "شهر", "اسبوع", "يوم"].map((tab) => (
            <TabButton
              tab={tab}
              activeTab={state.activeTab}
              setActiveTab={handleSetActiveTab}
            />
          ))}
        </View>
        <LabelContainer
          width="95%"
          label={
            state.silderValue
              ? `مدة الكفالة (${state.silderValue} ${state.activeTab})`
              : "مدة الكفالة"
          }
        >
          <Slider
            thumbTintColor={theme.primaryColor}
            containerStyle={{ width: 300, height: 40, alignSelf: "center" }}
            maximumValue={30}
            value={30}
            onValueChange={handleSliderChanges}
          />
        </LabelContainer>
        <TextInput
          value={state.activeAmount?.toFixed(2).toString() || 0}
          keyboardType="numeric"
          style={[
            styles.textInput,
            shadowStyles,
            { backgroundColor: theme.mangoBlack, color: theme.textColor },
          ]}
          placeholder="مبلغ اخر"
          placeholderTextColor={theme.secondaryTextColor}
        />
        <ContactDivider label="وتزودوا فإن خير الزاد التقوى" />
        <View style={styles.tabContainer}>
          {["Baridi", "BaridiMob", "Cash", "Stripe"].map((tab) => (
            <TabButton
              key={tab}
              tab={tab}
              activeTab={state.activeTab}
              setActiveTab={handleSetActiveTab}
            />
          ))}
        </View>
        {Object.keys(tabContents).map(
          (tab) =>
            tab === state.activeTab && (
              <Collapsible
                key={tab}
                style={styles.collapsible}
                collapsed={state.activeTab !== tab}
              >
                {tabContents[tab]}
              </Collapsible>
            )
        )}
        <ContactDivider textSize="sm" label={"او يمكنك استعمال رصيد حسابك: "} />
        <View style={styles.tabContainer}>
          <TabButton
            label={"استعمال رصيد حسابي"}
            tab={"useBalance"}
            activeTab={state.activeTab}
            setActiveTab={handleSetActiveTab}
          />
          {isLoggedIn && (
            <TabButton
              label={"تحويل نقاطي في سفراء عطاء"}
              tab={"usePoints"}
              activeTab={state.activeTab}
              setActiveTab={(tab) => {
                console.log("convert points");
                handleSetActiveTab(tab);
              }}
            />
          )}
          {state.activeTab === "usePoints" && (
            <>
              <Text center type="sm">
                عدد نقاطك : {user?.ambassadorRank} نقطة
                {"\n"} قيمة النقطة : 1 دج
              </Text>
              <TextInput
                value={data?.cartTotalAmount?.toString() || 0}
                onChange={handleInputChange}
                keyboardType="numeric"
                style={[
                  styles.textInput,
                  shadowStyles,
                  { backgroundColor: theme.mangoBlack, color: theme.textColor },
                ]}
                placeholder="عدد النقاط"
                placeholderTextColor={theme.secondaryTextColor}
              />
            </>
          )}
        </View>

        <View
          style={[
            styles.btnContainer,
            shadowStyles,
            {
              borderColor: theme.mangoBlack,
              backgroundColor: theme.mangoBlack,
            },
          ]}
        >
          <Text type="sm">
            تبرعك محمي بالكامل ولا يتم تخزين بياناتك الشخصية
          </Text>
          <Icon.FontAwesome6
            name="shield-heart"
            size={30}
            color={theme.textColor}
          />
        </View>
        {loading && (
          <ActivityIndicator
            size="large"
            color={theme.secondaryColor}
            animating={loading}
          />
        )}
        {alert && (
          <AlertMessage
            {...(alert.action && { onConfirm: alert.action })}
            message={alert.msg}
            type={alert.type}
          />
        )}
        {!disbaleDonateBtn && (
          <PrimaryBtn onPress={handleDonateNow} title="اكفلني الآن" />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    backgroundColor,
    gap: 30,
    marginVertical: 20,
    paddingBottom: 40,
  }),
  btnContainer: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 10,
    gap: 5,
    padding: 10,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  textInput: {
    padding: 10,
    textAlign: "center",
    borderRadius: 10,
  },
  tabContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  collapsible: {
    gap: 10,
  },
});

export default DonateNowModal;
