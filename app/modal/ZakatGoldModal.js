import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import LabelContainer, { Button } from "../components/ButtonWithLabel";
import { useTheme } from "../context/ThemeContext";
import CustomDropDown from "../components/CustomDropDown";
import Icon from "../components/Icon";
import ZakatModalFooter from "../components/ZakatModalFooter";
import Frame178 from "../assets/images/Frame178.png";
import Frame178_dark from "../assets/images/Frame178_dark.png";
import Text from "../components/Text";
import { usePreciousMetals } from "../context/PreciousMetalsContext";
import { useCurrency } from "../context/CurrencyContext";
import CountryFlag from "react-native-country-flag";
import {
  calculateZakatNetWeightGold,
  calculateZakatValue,
} from "../utils/zakatUtils";
import { useZakat } from "../context/ZakatContext";

export default function ZakatGoldModal({ closeModel, setAmount }) {
  const { goldData } = usePreciousMetals();
  const { currencyData, setBaseCurrency, loading } = useCurrency();
  const { addZakat } = useZakat();

  const [caliber, setCaliber] = useState({
    priceInDZD: goldData.prices[0].priceInDZD,
    unit: "14",
  });
  const [goldWeight, setGoldWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState({
    name: "جرام",
    code: "gram",
  });
  const [netWeight, setNetWeight] = useState(0);
  const [gramPrice, setGramPrice] = useState(0);
  const [code, setCode] = useState({
    code: "DZD",
    currencyName: "دينار جزائري",
  });

  const { isDarkMode, theme } = useTheme();
  const exchangeRate = currencyData.data["DZD"]?.value;

  const handleCurrencyChange = (curr) => {
    setCode(curr);
    setBaseCurrency(curr.code);
  };

  useEffect(() => {
    setNetWeight(
      calculateZakatNetWeightGold(
        goldWeight,
        caliber.unit,
        (unit = weightUnit.code)
      )
    );

    console.log(caliber.priceInDZD, exchangeRate);
    if (exchangeRate) {
      setGramPrice(caliber.priceInDZD / exchangeRate);
    }
  }, [code, exchangeRate, caliber, goldWeight, weightUnit]);
  const showToast = () => {
    const goldZakat = calculateZakatValue(netWeight, gramPrice).toFixed(2);
    if (netWeight >= 85) {
      addZakat("زكاة الذهب", goldZakat, 'goldAmount');
      ToastAndroid.show(
        `تم اضافة مبلغ زكاة الذهب بنجاح ، بلغت قيمته ${goldZakat} ${code.currencyName}`,
        ToastAndroid.LONG
      );
    } else {
      ToastAndroid.show(
        `النصاب : قيمة 85 غرام ذهب صافي فأكثر وإلا فإن الزكاة فيه غير مشروعة`,
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
      keyboardVerticalOffset={150}
      style={{
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <ScrollView>
        <ImageBackground
          source={isDarkMode ? Frame178_dark : Frame178}
          style={{ width: "100%", height: 120 }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Text type="md">
              سعر الغرام:
              <Text type="md" style={{ color: theme.steel }}>
                {gramPrice.toFixed(2)} {code.currencyName}
              </Text>
            </Text>
            <Text type="md">
              اخر تحديث:
              <Text style={{ color: theme.steel }} type="md">
                {goldData.date}
              </Text>
            </Text>
            <Text type="md">
              الوزن الصافي:
              <Text style={{ color: theme.steel }} type="md">
                {netWeight.toFixed(2)}
              </Text>{" "}
              غرام
            </Text>
            <Text type="md">
              المبلغ الكلي:
              <Text style={{ color: theme.steel }} type="md">
                {(netWeight * gramPrice).toFixed(2)}
              </Text>{" "}
              {code.currencyName}
            </Text>
          </View>
        </ImageBackground>

        {loading ? (
          <ActivityIndicator size="large" color={theme.textColor} />
        ) : (
          <LabelContainer width="95%" label="العملة (سعر البنك)">
            <Button
              isActive={code.code === "USD"}
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
              isActive={code.code === "EUR"}
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
              isActive={code.code === "DZD"}
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
        <LabelContainer width="95%" label="العيار">
          <FlatList
            inverted
            data={goldData.prices}
            keyExtractor={(item) => item.unit}
            renderItem={({ item }) => (
              <Button
                isActive={caliber.unit === item.unit}
                label={item.unit}
                onPress={() => setCaliber(item)}
              />
            )}
            horizontal
          />
        </LabelContainer>
        <LabelContainer label="وحدة الوزن">
          <CustomDropDown
            style={{ marginRight: 10 }}
            width="100%"
            height={50}
            handleChanges={(value) => setWeightUnit(value)}
            data={[
              { name: "جرام", code: "gram" },
              { name: "اونصة", code: "ounce" },
              { name: "كيلوغرام", code: "kilogram" },
            ]}
            valueField="code"
            value={weightUnit}
            labelField="name"
            searchField="name"
            icon={
              <Icon.FontAwesome5
                name="weight-hanging"
                size={18}
                color={theme.textColor}
              />
            }
          />
        </LabelContainer>

        <TextInput
          onChangeText={(text) => setGoldWeight(text)}
          keyboardType="numeric"
          style={{
            marginBottom: 20,
            width: "100%",
            height: 50,
            borderWidth: 2,
            borderColor: theme.borderColor,
            borderRadius: 5,
            padding: 10,
            marginVertical: 10,
            textAlign: "center",
            color: theme.textColor,
          }}
          placeholderTextColor={theme.steel}
          placeholder="وزن الذهب"
        />

        <ZakatModalFooter
          submitLabel="احسب"
          onPress={showToast}
          closeModel={closeModel}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
