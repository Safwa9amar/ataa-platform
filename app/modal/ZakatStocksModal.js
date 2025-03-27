import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  View,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  ImageBackground,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import LabelContainer, { Button } from "../components/ButtonWithLabel";
import Icon from "../components/Icon";
import ZakatModalFooter from "../components/ZakatModalFooter";
import Text from "../components/Text";
import { useCurrency } from "../context/CurrencyContext";
import CountryFlag from "react-native-country-flag";
import CollapsibleItem from "../components/CollapsibleItem";
import { Row, Rows, Table } from "react-native-reanimated-table";
import Frame176 from "../assets/images/Frame176.png";
import Frame176_dark from "../assets/images/Frame176_dark.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useZakat } from "../context/ZakatContext";
import { usePreciousMetals } from "../context/PreciousMetalsContext";

const ZakatStocksModal = ({ closeModel }) => {
  const { goldData } = usePreciousMetals();
  const { currencyData, setBaseCurrency, loading } = useCurrency();
  const { isDarkMode, theme } = useTheme();
  const { addZakat } = useZakat();

  const [currency, setCurrency] = useState({
    code: "DZD",
    currencyName: "الدينار جزائري",
  });
  const [totalStockPrice, setTotalStockPrice] = useState(0);
  const [stockAmount, setStockAmount] = useState("");
  const [stockPrice, setStockPrice] = useState("");
  const [stockName, setStockName] = useState("");
  const [stockData, setStockData] = useState([]);

  const stockNameRef = useRef(null);
  const stockPriceRef = useRef(null);
  const stockAmountRef = useRef(null);

  const exchangeRate = currencyData?.data["DZD"]?.value || 1;

  const handleAddStock = () => {
    console.log(stockAmount, stockPrice);
    if (stockAmount === "" || stockPrice === "") {
      ToastAndroid.show("الرجاء ادخال القيمة و العدد", ToastAndroid.SHORT);
      return;
    }
    const newStock = {
      id: stockData.length + 1,
      stockName,
      stockAmount: parseFloat(stockAmount),
      stockPrice: parseFloat(stockPrice),
    };
    setStockData([...stockData, newStock]);

    // Clear input fields
    setStockName("");
    setStockAmount("");
    setStockPrice("");
    stockNameRef.current.focus();
    ToastAndroid.show("تمت الاضافة بنجاح", ToastAndroid.SHORT);
  };

  const handleRemoveStock = () => {
    setStockData(stockData.slice(0, -1));
    const lastStock = stockData[stockData.length - 1];
    if (lastStock) {
      setStockName(lastStock.stockName);
      setStockAmount(lastStock.stockAmount.toString());
      setStockPrice(lastStock.stockPrice.toString());
      stockNameRef.current.focus();
    }
  };

  useEffect(() => {
    // Calculate the total stock price based on stock data
    const total = stockData.reduce(
      (acc, { stockPrice, stockAmount }) => acc + stockPrice * stockAmount,
      0
    );
    setTotalStockPrice(total);
  }, [stockData]);

  const handleCurrencyChange = (value) => {
    setCurrency(value);
    setBaseCurrency(value.code);
  };

  const currencyButtons = useMemo(
    () => [
      {
        code: "USD",
        currencyName: "دولار امريكي",
        isoCode: "us",
      },
      {
        code: "EUR",
        currencyName: "يورو",
        isoCode: "eu",
      },
      {
        code: "DZD",
        currencyName: "دينار جزائري",
        isoCode: "dz",
      },
    ],
    []
  );

  const calculateZakat = () => {
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
    if (typeof totalStockPrice === "undefined" || totalStockPrice === null) {
      // Display error message using ToastAndroid
      ToastAndroid.show("لم يتم توفير المبلغ لحساب الزكاة.", ToastAndroid.LONG);
      return;
    }

    // التحقق مما إذا كان المبلغ يفي بشرط النصاب
    if (totalStockPrice >= nisabPriceDZD) {
      // حساب قيمة الزكاة المطلوبة
      const zakatStocks = totalStockPrice * 0.025;

      // إضافة الزكاة
      addZakat("زكاة الاسهم", parseFloat(zakatStocks.toFixed(2)), 'stockAmount');

      // رسالة نجاح
      ToastAndroid.show(
        `تم إضافة مبلغ زكاة الاسهم بنجاح، بلغت قيمته ${zakatStocks} دينار جزائري`,
        ToastAndroid.LONG
      );
      // إغلاق النموذج بعد تأخير
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
  const inputStyles = {
    marginBottom: 20,
    height: 40,
    borderWidth: 2,
    borderColor: theme.borderColor,
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
    textAlign: "center",
    color: theme.textColor,
    fontFamily: theme.fontFamily,
  };

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
          style={styles.headerImage}
        >
          <Text>
            {(totalStockPrice / exchangeRate).toFixed(2)}{" "}
            {currency.currencyName}
          </Text>
          <Text type="sm">اجمالي قيمة الاسهم</Text>
        </ImageBackground>

        <View>
          {loading ? (
            <ActivityIndicator size="large" color={theme.textColor} />
          ) : (
            <LabelContainer width="95%" label="العملة (سعر البنك)">
              {currencyButtons.map(({ code, currencyName, isoCode }) => (
                <Button
                  key={code}
                  isActive={currency.code === code}
                  label={code}
                  icon={<CountryFlag isoCode={isoCode} size={15} />}
                  onPress={() => handleCurrencyChange({ code, currencyName })}
                />
              ))}
            </LabelContainer>
          )}
        </View>

        <TextInput
          ref={stockNameRef}
          value={stockName}
          onChangeText={setStockName}
          style={inputStyles}
          placeholderTextColor={theme.steel}
          placeholder="اسم السهم"
        />
        <TextInput
          ref={stockAmountRef}
          value={stockAmount}
          onChangeText={setStockAmount}
          keyboardType="numeric"
          style={inputStyles}
          placeholderTextColor={theme.steel}
          placeholder="عدد الاسهم"
        />
        <TextInput
          ref={stockPriceRef}
          value={stockPrice}
          onChangeText={setStockPrice}
          keyboardType="numeric"
          style={inputStyles}
          placeholderTextColor={theme.steel}
          placeholder="قيمة السهم في السوق بتاريخ اخراج الزكاة + الارباح"
        />
        <View style={styles.buttonContainer}>
          <Button
            icon={
              <Icon.FontAwesome5 name="plus" size={16} color={theme.white} />
            }
            label="اضافة سهم"
            isActive
            onPress={handleAddStock}
          />
          <Button
            icon={<Icon.MaterialCommunityIcons name="backup-restore" size={16} color={theme.white}/>}
            label="عودة"
            bgColor={theme.errorColor}
            isActive
            onPress={handleRemoveStock}
          />
        </View>

        <CollapsibleItem
          style={styles.collapsibleItem}
          isCollapsed
          icon={
            <Icon.FontAwesome
              name="history"
              size={20}
              color={theme.textColor}
            />
          }
          label="عرض سجل الاسهم"
        >
          <Table
            style={styles.table}
            borderStyle={styles.tableBorder(theme.borderColor)}
          >
            <Row
              style={styles.head(theme.primaryColor)}
              textStyle={styles.Tabletext("white")}
              data={["ازالة", "القيمة (دج)", "عدد الاسهم", "اسم السهم"]}
            />
            <Rows
              textStyle={styles.Tabletext(theme.textColor)}
              data={stockData.map((item) => [
                <Icon.AntDesign
                  key={item.id}
                  onPress={() =>
                    setStockData(
                      stockData.filter((stock) => stock.id !== item.id)
                    )
                  }
                  style={styles.deleteIcon}
                  name="delete"
                  size={20}
                  color={theme.errorColor}
                />,
                item.stockPrice * item.stockAmount,
                item.stockAmount,
                item.stockName,
              ])}
            />
          </Table>
        </CollapsibleItem>

        <ZakatModalFooter
          submitLabel="احسب"
          closeModel={closeModel}
          onPress={calculateZakat}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  collapsibleItem: {
    width: "95%",
  },
  table: {},
  tableBorder: (borderColor) => ({
    borderColor,
    borderWidth: 2,
  }),
  head: (secondaryColor) => ({
    height: 40,
    backgroundColor: secondaryColor,
  }),
  Tabletext: (color) => ({
    margin: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color,
  }),
  deleteIcon: {
    alignSelf: "center",
  },
});

export default ZakatStocksModal;
