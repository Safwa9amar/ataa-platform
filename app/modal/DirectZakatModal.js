import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import { Button } from "../components/ButtonWithLabel";
import { useTheme } from "../context/ThemeContext";
import React from "react";
import { CONSTANTS } from "../config/config";
import { usePreciousMetals } from "../context/PreciousMetalsContext";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDonationModalContext } from "../context/DonationModalContext";
// TODO handle the direct zakat payment process
export default function DirectZakatModal({ closeModel }) {
  const navigation = useNavigation();
  const { toggleDonationModal } = useDonationModalContext();
  // const { goldData } = usePreciousMetals();
  // const Unit24 = goldData.prices.find((item) => item.unit === "24");
  // const Unit24PriceDZD = parseFloat(Unit24.priceInDZD);
  // const nisabPriceDZD = Unit24PriceDZD * 85;
  const [amount, setAmount] = useState("");

  const handleAmountChange = (text) => {
    setAmount(parseInt(text));
  };

  const handleCalculateZakat = () => {
    if (amount <= 0) {
      return ToastAndroid.show(`يرجى ملئ مبلغ الزكاة `, ToastAndroid.LONG);
    }

    toggleDonationModal();

    navigation.getParent().setParams({
      typeOfDonation: "donateNow",
      donationData: {
        id: "",
        cartTotalAmount: amount,
        title: "زكاة المال",
        fieldTitle: "برامجنا",
        categoryTitle: "زكاة المال",
        donationType: CONSTANTS.DONATION_TYPES.ZAKAT,
        CampaignType: "",
        unitPrice: 0,
        isDirectZakat: true,
      },
    });

    closeModel();
  };
  const ref = React.useRef();
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
        flex: 1,
      }}
    >
      <TextInput
        onChangeText={handleAmountChange}
        ref={ref}
        onLayout={() => {
          ref.current.focus();
        }}
        keyboardType="numeric"
        style={{
          width: 300,
          height: 80,
          borderWidth: 2,
          borderColor: theme.borderColor,
          borderRadius: 5,
          padding: 10,
          marginVertical: 10,
          textAlign: "center",
          color: theme.textColor,
        }}
        placeholderTextColor={theme.textColor}
        placeholder="ملئ مبلغ الزكاة"
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: 300,
        }}
      >
        <Button
          onPress={handleCalculateZakat}
          label="متابعة الدفع"
          isActive={true}
        />
        <Button onPress={closeModel} label="الغاء" isActive={false} />
      </View>
    </KeyboardAvoidingView>
  );
}
