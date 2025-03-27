import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import CustomDropDown from "../components/CustomDropDown";
import Icon from "../components/Icon";
import ZakatModalFooter from "../components/ZakatModalFooter";
import { useZakat } from "../context/ZakatContext";
import { useCurrency } from "../context/CurrencyContext";
import LabelContainer, { Button } from "../components/ButtonWithLabel";
import CountryFlag from "react-native-country-flag";
import { usePreciousMetals } from "../context/PreciousMetalsContext";

export default function ZakatElmalModal({ closeModel }) {
  const { currencyData, setBaseCurrency, loading } = useCurrency();
  const [currency, setCurrency] = useState({ code: "DZD" });
  const exchangeRate = currencyData.data["DZD"]?.value;
  const { goldData } = usePreciousMetals();

  const { addZakat } = useZakat();
  const { theme } = useTheme();
  const [amount, setAmount] = useState("");

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setBaseCurrency(value.code);
  };
  const handleAddZakat = () => {
    // Find the item with 24 karat gold price in DZD
    const Unit24 = goldData.prices.find((item) => item.unit === "24");

    if (!Unit24) {
      // Display error message using ToastAndroid
      ToastAndroid.show(
        "لم يتم العثور على سعر الذهب عيار 24.",
        ToastAndroid.LONG
      );
      return;
    }
    // سعر الغرام الواحد من الذهب عيار 24 بالدينار الجزائري
    const Unit24PriceDZD = parseFloat(Unit24.priceInDZD);
    // حساب النصاب بسعر 85 غرام من الذهب عيار 24
    const nisabPriceDZD = Unit24PriceDZD * 85;
    // التحقق من وجود المتغير amount
    if (typeof amount === "undefined" || amount === null) {
      // Display error message using ToastAndroid
      ToastAndroid.show("لم يتم توفير المبلغ لحساب الزكاة.", ToastAndroid.LONG);
      return;
    }

    // التحقق مما إذا كان المبلغ يفي بشرط النصاب
    if (amount >= nisabPriceDZD) {
      // حساب قيمة الزكاة المطلوبة
      const zakatElmal = (amount * 0.025).toFixed(2);
      // إضافة الزكاة
      addZakat("زكاة المال", zakatElmal, 'cashAmount');
      // رسالة نجاح
      ToastAndroid.show(
        `تم إضافة مبلغ زكاة المال بنجاح، بلغت قيمته ${zakatElmal} دينار جزائري`,
        ToastAndroid.LONG
      );
      // // إغلاق النموذج بعد تأخير
      // setTimeout(() => {
      //   closeModel();
      // }, 5000);
    } else {
      // رسالة خطأ إذا كان المبلغ أقل من النصاب
      ToastAndroid.show(
        `النصاب: قيمة 85 غرام ذهب صافي اي ${nisabPriceDZD} دج فأكثر وإلا فإن الزكاة فيه غير مشروعة`,
        ToastAndroid.LONG
      );
    }
  };

  useEffect(() => {
    return () => {
      setBaseCurrency("DZD");
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={50}
      style={styles.container}
    >
      <TextInput
        onChangeText={setAmount}
        keyboardType="numeric"
        style={[
          styles.input,
          { borderColor: theme.borderColor, color: theme.textColor },
        ]}
        placeholderTextColor={theme.textColor}
        placeholder="ملئ مبلغ الزكاة"
      />
      <View>
        {loading ? (
          <ActivityIndicator size="large" color={theme.textColor} />
        ) : (
          <LabelContainer width="95%" label="العملة (سعر البنك)">
            <Button
              isActive={currency.code === "USD"}
              label="USD"
              icon={<CountryFlag isoCode="us" size={15} />}
              onPress={() =>
                handleCurrencyChange({
                  code: "USD",
                  currencyName: "دولار امريكي",
                })
              }
            />
            <Button
              isActive={currency.code === "EUR"}
              label="EUR"
              icon={<CountryFlag isoCode="eu" size={15} />}
              onPress={() =>
                handleCurrencyChange({
                  code: "EUR",
                  currencyName: "يورو",
                })
              }
            />
            <Button
              label="DZD"
              isActive={currency.code === "DZD"}
              icon={<CountryFlag isoCode="dz" size={15} />}
              onPress={() =>
                handleCurrencyChange({
                  code: "DZD",
                  currencyName: "دينار جزائري",
                })
              }
            />
          </LabelContainer>
        )}
      </View>
      <ZakatModalFooter
        submitLabel="احسب"
        onPress={handleAddZakat}
        closeModel={closeModel}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 50,
    flex: 1,
  },
  input: {
    marginBottom: 20,
    width: 300,
    height: 80,
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    textAlign: "center",
  },
});
