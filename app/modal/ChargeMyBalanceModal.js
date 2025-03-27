import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import Collapsible from "react-native-collapsible";
import TabButton from "../components/FastDontion/TabButton";
import AmountButton from "../components/FastDontion/AmountButton";
import BaridiTab from "../components/FastDontion/BaridiTab";
import BaridiMobTab from "../components/FastDontion/BaridiMobTab";
import CashTab from "../components/FastDontion/CashTab";
import Stripe from "../components/FastDontion/Stripe";
import { shadowStyles } from "../components/FastDontion/shadowStyles";
import Text from "../components/Text";
import Icon from "../components/Icon";
import PrimaryBtn from "../components/PrimaryBtn";
import { useCredentials } from "../context/CredentialsContext";
import { createRecharge } from "../services/rechargeService";
import AlertMessage from "../components/AlertMessage";

const ChargeMyBalanceModal = () => {
  const { user, userToken, checkAuthentication } = useCredentials();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [recipientPhoto, setRecipientPhoto] = useState(null);
  const [state, setState] = useState({
    activeAmount: 0,
    activeTab: "",
  });

  const handleAmountPress = (amount) => {
    setState((prevState) => ({ ...prevState, activeAmount: amount }));
  };

  const handleTabChange = (tab) => {
    setState((prevState) => ({ ...prevState, activeTab: tab }));
  };

  const handleInputChange = (text) => {
    setState((prevState) => ({
      ...prevState,
      activeAmount: parseFloat(text) || 0,
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
    Stripe: <Stripe />,
  };

  const handleDonateNow = async () => {
    if (state.activeAmount < 100) {
      setAlert({
        msg: state.activeAmount === 0 ? "الرجاء اختيار مبلغ" : "الحد الأدنى للشحن هو 100 دج",
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
    if(recipientPhoto === null) {
      setAlert({
        msg: "الرجاء تحميل صورة الإيصال",
        type: "error",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await createRecharge(
        {
          amount: state.activeAmount,
          points: state.activeAmount,
          userId: user.id,
        },
        userToken
      );
      if (res) {
        checkAuthentication(userToken);
        setAlert({
          msg: "تمت العملية بنجاح الرجاء منك الانتظار حتى يتم قبول شحنك من طرف المنصة",
          type: "success",
        });
      }
    } catch (error) {
      console.error(error.message);
      setAlert({
        msg: "فشل شحن الرصيد",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container(theme.mangoBlack)}>
      <View style={styles.amountContainer}>
        {[1000, 500, 100].map((amount) => (
          <AmountButton
            key={amount}
            onPress={() => handleAmountPress(amount)}
            amount={amount}
            activeAmount={state.activeAmount}
          />
        ))}
      </View>
      <TextInput
        onChangeText={handleInputChange}
        keyboardType="numeric"
        style={[
          styles.textInput,
          shadowStyles,
          { backgroundColor: theme.mangoBlack, color: theme.textColor },
        ]}
        placeholder="مبلغ اخر"
        placeholderTextColor={theme.textColor}
      />
      <View style={styles.tabContainer}>
        {["Baridi", "BaridiMob", "Cash", "Stripe"].map((tab) => (
          <TabButton
            key={tab}
            tab={tab}
            activeTab={state.activeTab}
            setActiveTab={handleTabChange}
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
      <View
        style={[
          styles.btnContainer,
          shadowStyles,
          { borderColor: theme.mangoBlack, backgroundColor: theme.mangoBlack },
        ]}
      >
        <Text type="sm">الشحن محمي بالكامل ولا يتم تخزين بياناتك الشخصية</Text>
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
      {alert && <AlertMessage message={alert.msg} type={alert.type} />}
      <PrimaryBtn title="شحن حسابي" onPress={handleDonateNow} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    backgroundColor,
    gap: 20,
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
    gap: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  collapsible: {
    gap: 10,
  },
});

export default ChargeMyBalanceModal;
