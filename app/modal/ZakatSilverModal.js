import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView,
  ToastAndroid,
  FlatList,
} from "react-native";
import LabelContainer, { Button } from "../components/ButtonWithLabel";
import { useTheme } from "../context/ThemeContext";
import CustomDropDown from "../components/CustomDropDown";
import Icon from "../components/Icon";
import ZakatModalFooter from "../components/ZakatModalFooter";
import Frame176 from "../assets/images/Frame176.png";
import Frame176_dark from "../assets/images/Frame176_dark.png";
import Text from "../components/Text";
import { usePreciousMetals } from "../context/PreciousMetalsContext";
import { useCurrency } from "../context/CurrencyContext";
import {
  calculateZakatNetWeightSilver,
  calculateZakatValue,
} from "../utils/zakatUtils";
import CountryFlag from "react-native-country-flag";
import { useZakat } from "../context/ZakatContext";

export default function ZakatSilverModal({ closeModel, setAmount }) {
  const { silverData } = usePreciousMetals();
  const price = silverData.prices[0].priceInDZD;
  const { addZakat } = useZakat();
  const { currencyData, setBaseCurrency, loading } = useCurrency();

  const [caliber, setCaliber] = useState({
    priceInDZD: silverData.prices[0].priceInDZD,
    unit: silverData.prices[0].unit, // Assuming 100% purity for silver
  });
  const [silverWeight, setSilverWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState({
    name: "جرام",
    code: "gram",
  });
  const [netWeight, setNetWeight] = useState(0);
  const [gramPrice, setGramPrice] = useState(price);
  const [code, setCode] = useState({
    code: "DZD",
    currencyName: "دينار جزائري",
  });
  const { isDarkMode, theme } = useTheme();
  const exchangeRate = currencyData.data["DZD"]?.value.toFixed(2);

  const handleCurrencyChange = (curr) => {
    setCode(curr);
    setBaseCurrency(curr.code);
  };

  useEffect(() => {
    setNetWeight(
      calculateZakatNetWeightSilver(
        silverWeight,
        caliber.unit,
        (unit = weightUnit.code)
      )
    );

    console.log(caliber.priceInDZD, exchangeRate);
    if (exchangeRate) {
      setGramPrice((caliber.priceInDZD / exchangeRate).toFixed(2));
    }
  }, [code, exchangeRate, caliber, silverWeight, weightUnit]);
  const showToast = () => {
    const silverZakat = (
      calculateZakatValue(netWeight, gramPrice) * exchangeRate
    ).toFixed(2);
    if (netWeight >= 595) {
      addZakat("زكاة الفضة", silverZakat, 'silverAmount');
      ToastAndroid.show(
        `تم اضافة مبلغ زكاة الفضة بنجاح ، بلغت قيمته ${silverZakat} دينار جزائري`,
        ToastAndroid.LONG
      );
      // setTimeout(() => {
      //   closeModel();
      // }, 5000);
    } else {
      ToastAndroid.show(
        `النصاب : قيمة 595 غرام فضة صافي فأكثر وإلا فإن الزكاة فيه غير مشروعة`,
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
          source={isDarkMode ? Frame176_dark : Frame176}
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
                {gramPrice} ({code.currencyName})
              </Text>
            </Text>
            <Text type="md">
              اخر تحديث:
              <Text style={{ color: theme.steel }} type="md">
                {silverData.date}
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
                {netWeight * gramPrice}
              </Text>{" "}
              {code.currencyName}
            </Text>
          </View>
        </ImageBackground>
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
        <LabelContainer width="95%" label="العيار">
          <FlatList
            data={silverData.prices}
            keyExtractor={(item) => item.unit}
            renderItem={({ item }) => (
              <Button
                isActive={caliber.unit === item.unit}
                label={item.unit}
                onPress={() => setCaliber(item)}
              />
            )}
            inverted
            horizontal
          />
        </LabelContainer>
        <LabelContainer width="95%" label="وحدة الوزن">
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
          onChangeText={(text) => setSilverWeight(text)}
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
          placeholder="وزن الفضة"
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
