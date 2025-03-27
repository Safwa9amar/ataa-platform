import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import Collapsible from "react-native-collapsible";
import TabButton from "../../components/FastDontion/TabButton";
import AmountButton from "../../components/FastDontion/AmountButton";
import Button from "../../components/FastDontion/Button";
import BaridiTab from "../../components/FastDontion/BaridiTab";
import BaridiMobTab from "../../components/FastDontion/BaridiMobTab";
import CashTab from "../../components/FastDontion/CashTab";
import OtherTab from "../../components/FastDontion/Stripe";
import { shadowStyles } from "../../components/FastDontion/shadowStyles";
import Text from "../../components/Text";
import Icon from "../../components/Icon";
import PrimaryBtn from "../../components/PrimaryBtn";
import AlertMessage from "../../components/AlertMessage";

const FastDonationModal = () => {
  const { theme } = useTheme();
  const [recipientPhoto, setRecipientPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const timer = useRef();
  const [state, setState] = useState({
    activeBtn: "مشاريع",
    activeAmount: 0,
    activeTab: "",
  });

  const handleAmountPress = (amount) => {
    setState((prevState) => ({ ...prevState, activeAmount: amount }));
  };

  const handleSetActiveBtn = (btn) => {
    setState((prevState) => ({ ...prevState, activeBtn: btn }));
  };

  const handleSetActiveTab = (tab) => {
    setState((prevState) => ({ ...prevState, activeTab: tab }));
  };

  const handleInputChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      activeAmount: e.nativeEvent.text,
    }));
  };

  const handleFastDonation = () => {
    console.log("Fast Donation");
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      setAlert({
        type: "success",
        message: "تم التبرع بنجاح",
      });
    }, 3000);
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
  };

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container(theme.mangoBlack)}>
      <Text center>التبرع السريع</Text>
      <View
        style={[
          styles.btnContainer,
          shadowStyles,
          { borderColor: theme.mangoBlack, backgroundColor: theme.mangoBlack },
        ]}
      >
        <Button
          title="متجر"
          activeBtn={state.activeBtn}
          setActiveBtn={handleSetActiveBtn}
        />
        <Button
          title="تيسرت"
          activeBtn={state.activeBtn}
          setActiveBtn={handleSetActiveBtn}
        />
        <Button
          title="فرجت"
          activeBtn={state.activeBtn}
          setActiveBtn={handleSetActiveBtn}
        />
        <Button
          title="اغاثة"
          activeBtn={state.activeBtn}
          setActiveBtn={handleSetActiveBtn}
        />
        <Button
          title="حملات"
          activeBtn={state.activeBtn}
          setActiveBtn={handleSetActiveBtn}
        />

        <Button
          title="مشاريع"
          activeBtn={state.activeBtn}
          setActiveBtn={handleSetActiveBtn}
        />
      </View>
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
        onChange={handleInputChange}
        keyboardType="numeric"
        style={[
          styles.textInput,
          shadowStyles,
          { backgroundColor: theme.mangoBlack, color: theme.textColor },
        ]}
        placeholder="مبلغ اخر"
        placeholderTextColor={theme.textColor}
      />
      <Text type="md">سيذهب تبرعك تلقائيا الى الحالات الأشد احتياجا</Text>
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
      <View
        style={[
          styles.btnContainer,
          shadowStyles,
          { borderColor: theme.mangoBlack, backgroundColor: theme.mangoBlack },
        ]}
      >
        <Text type="sm">تبرعك محمي بالكامل ولا يتم تخزين بياناتك الشخصية</Text>
        <Icon.FontAwesome6
          name="shield-heart"
          size={30}
          color={theme.textColor}
        />
      </View>
      {loading && (
        <ActivityIndicator
          animating={loading}
          size="large"
          color={theme.textColor}
        />
      )}
      {alert && <AlertMessage message={alert.message} type={alert.type} />}
      <PrimaryBtn onPress={handleFastDonation} title="تبرع الان" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: (backgroundColor) => ({
    backgroundColor,
    gap: 20,
    marginVertical: 20,
    paddingBottom: 40,
    alignItems: "center",
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
    width: "100%",
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

export default FastDonationModal;
