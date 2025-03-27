import React, { useEffect, useLayoutEffect } from "react";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTheme } from "../../context/ThemeContext";

import Icon from "../../components/Icon";
import CustomScreenHeader from "../../components/CustomScreenHeader";
import Text from "../../components/Text";
import ScreensContainer from "../../components/ScreensContainer";
import ModelWrapper from "../../components/ModelWrapper";
import CollapsibleItem from "../../components/CollapsibleItem";

import ZakatElmalModal from "../../modal/ZakatElmalModal";
import ZakatGoldModal from "../../modal/ZakatGoldModal";
import ZakatSilverModal from "../../modal/ZakatSilverModal";
import ZakatStocksModal from "../../modal/ZakatStocksModal";

import image48 from "../../assets/images/image48.png";
import Frame272 from "../../assets/images/Frame272.png";
import Frame272_dark from "../../assets/images/Frame272_dark.png";
import Frame271 from "../../assets/images/Frame271.png";
import Frame271_dark from "../../assets/images/Frame271_dark.png";
import Frame274 from "../../assets/images/Frame274.png";
import Frame274_dark from "../../assets/images/Frame274_dark.png";
import Frame273 from "../../assets/images/Frame273.png";
import Frame273_dark from "../../assets/images/Frame273_dark.png";
import Frame__274 from "../../assets/images/Frame__274.png";
import Frame_274_dark from "../../assets/images/Frame_274_dark.png";
import { Row, Rows, Table } from "react-native-reanimated-table";
import { useZakat, ZakatProvider } from "../../context/ZakatContext";
import { useNavigation } from "@react-navigation/native";
import { useDonationModalContext } from "../../context/DonationModalContext";
import API_ENDPOINTS, { CONSTANTS } from "../../config/config";
import { useCredentials } from "../../context/CredentialsContext";
import { Button } from "../../components/ButtonWithLabel";
import ContactDivider from "../../components/ContactDivider";
import DatePicker from "react-native-date-picker";
import getPreviousYearsArray from "../../utils/getPreviousYearsArray";
import TabItem from "../../components/TabItem";
import RapportModal from "../../modal/RapportModal";

const ZakatCalculatorScreen = ({ navigation }) => {
  const { zakatData, deleteZakat, totalAmount } = useZakat();
  const { toggleDonationModal } = useDonationModalContext();
  const { user, isLoggedIn } = useCredentials();
  const { isDarkMode, theme } = useTheme();
  const [zakatType, setZakatType] = React.useState("gold");
  const [isModelOpen, setIsModelOpen] = React.useState(false);
  const currentZakatForThisYear = user.zakat?.find(
    (item) =>
      item.createdAt.split("T")[0].split("-")[0] ===
      new Date().getFullYear().toString()
  );
  // check if there is previous zakat in the previous years
  const previousYears = getPreviousYearsArray();
  const previousZakat = user.zakat?.filter((item) =>
    previousYears.includes(item.year)
  );

  const [zakatYear, setZakatYear] = React.useState(new Date("2024-01-01"));
  const [isRapportModalOpen, setIsRapportModalOpen] = React.useState(false);

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
            <Icon.Entypo name="calculator" size={22} color={theme.textColor} />
          }
          navigation={navigation}
          label="حاسبة الزكاة"
        />
      ),
    });
  }, [navigation, theme.textColor]);

  const handleZakatTypeChange = (type) => {
    setZakatType(type);
    setIsModelOpen(true);
  };

  const handleCalculateZakat = () => {
    closeModel();
    navigation.getParent().setParams({
      typeOfDonation: "donateNow",
      donationData: {
        id: "",
        cartTotalAmount: totalAmount,
        title: "زكاة المال",
        fieldTitle: "برامجنا",
        categoryTitle: "زكاة المال",
        donationType: CONSTANTS.DONATION_TYPES.ZAKAT,
        CampaignType: "",
        unitPrice: 0,
        isCalculatedZakat: true,
        zakatData: zakatData,
      },
    });

    toggleDonationModal();
  };

  return (
    <ScreensContainer style={styles.screensContainer}>
      <Image source={image48} style={styles.image} />
      <ImageBackground
        source={isDarkMode ? Frame_274_dark : Frame__274}
        style={styles.summaryBackground}
      >
        <Text type="md" style={[styles.text, { color: theme.steel }]}>
          اجمالي الزكاة المستحقة
        </Text>
        <Text type="md" style={styles.zakatAmountText(theme.textColor)}>
          {totalAmount} {process.env.APP_CURRENCY_NAME}
        </Text>
      </ImageBackground>
      <View style={styles.zakatOptionsContainer}>
        {renderImageWithText(
          isDarkMode ? Frame272_dark : Frame272,
          "الذهب",
          theme,
          () => handleZakatTypeChange("gold")
        )}
        {renderImageWithText(
          isDarkMode ? Frame271_dark : Frame271,
          "المال",
          theme,
          () => handleZakatTypeChange("money")
        )}
        {renderImageWithText(
          isDarkMode ? Frame274_dark : Frame274,
          "الاسهم",
          theme,
          () => handleZakatTypeChange("stocks")
        )}
        {renderImageWithText(
          isDarkMode ? Frame273_dark : Frame273,
          "الفضة",
          theme,
          () => handleZakatTypeChange("silver")
        )}
      </View>

      {totalAmount > 0 && (
        <CollapsibleItem
          style={{
            width: "90%",
          }}
          isCollapsed={true}
          icon={
            <Icon.FontAwesome
              name="history"
              size={20}
              color={theme.textColor}
            />
          }
          label={"عرض سجل الحاسسبة"}
        >
          <Table
            style={styles.table}
            borderStyle={styles.tableBorder(theme.borderColor)}
          >
            <Row
              style={styles.head(theme.primaryColor)}
              textStyle={styles.Tabletext("white")}
              data={["ازالة", "القيمة بالدينار", "نوع الزكاة"]}
            />
            <Rows
              textStyle={styles.Tabletext(theme.textColor)}
              data={zakatData.map((item, index) => [
                <Icon.Entypo
                  style={{ alignSelf: "center" }}
                  name="trash"
                  size={20}
                  onPress={() => deleteZakat(index)}
                />,
                item.amount,
                item.ar_name,
              ])}
            />
          </Table>
        </CollapsibleItem>
      )}

      {isLoggedIn && currentZakatForThisYear && (
        <CollapsibleItem
          style={{
            width: "90%",
          }}
          icon={
            <Icon.FontAwesome5
              name="file-invoice"
              size={20}
              color={theme.textColor}
            />
          }
          isCollapsed
          label={"عرض تقرير الزكاة للسنة الحالية"}
        >
          <Button
            onPress={() => {
              setZakatYear(null);
              setIsRapportModalOpen(true);
              setIsModelOpen(true);
            }}
            bgColor={theme.secondaryColor}
            isActive
            label="عرض تقرير الزكاة"
            width={"80%"}
          />
        </CollapsibleItem>
      )}
      {previousZakat?.length > 0 && (
        <CollapsibleItem
          icon={<Icon.Fontisto name="date" size={20} color={theme.textColor} />}
          style={{ width: "90%" }}
          isCollapsed
          label={"عرض تقرير الزكاة حسب السنة"}
        >
          <DatePicker
            mode="date"
            locale="ar-DZ"
            maximumDate={new Date()}
            theme={isDarkMode ? "dark" : "light"}
            date={new Date(zakatYear)}
            onDateChange={(date) => {
              setZakatYear(date);
            }}
          />
          {zakatYear && (
            <Button
              onPress={() => {
                setIsRapportModalOpen(true);
                setIsModelOpen(true);
              }}
              bgColor={theme.secondaryColor}
              isActive
              label="عرض التقرير"
            />
          )}
        </CollapsibleItem>
      )}
      {!currentZakatForThisYear && (
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={handleCalculateZakat}
        >
          <Text type="md" style={styles.proceedButtonText}>
            متابعة الدفع
          </Text>
        </TouchableOpacity>
      )}
      <ModelWrapper isModelOpen={isModelOpen} closeModel={closeModel}>
        {isRapportModalOpen ? (
          <RapportModal
            data={{
              name: "تقرير الزكاة",
              rapportType: "userZakatReport",
              URI: `${
                API_ENDPOINTS.REPPORTS.GET_ZAKAT_REPPORT
              }/${zakatYear?.getFullYear()}`,
            }}
          />
        ) : (
          <>
            {zakatType === "money" && (
              <ZakatElmalModal closeModel={closeModel} />
            )}
            {zakatType === "gold" && <ZakatGoldModal closeModel={closeModel} />}
            {zakatType === "silver" && (
              <ZakatSilverModal closeModel={closeModel} />
            )}
            {zakatType === "stocks" && (
              <ZakatStocksModal closeModel={closeModel} />
            )}
          </>
        )}
      </ModelWrapper>
    </ScreensContainer>
  );
};

const renderImageWithText = (imageSource, text, theme, onPress) => (
  <TouchableOpacity onPress={onPress} style={styles.imageTouchable}>
    <ImageBackground source={imageSource} style={styles.imageBackground}>
      <Text type="md" style={[styles.text, { color: theme.textColor }]}>
        {text}
      </Text>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  screensContainer: {
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: 250,
    height: 200,
    alignSelf: "center",
  },
  zakatOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginTop: 20,
  },
  imageTouchable: {
    marginBottom: 20,
  },
  imageBackground: {
    width: 170,
    height: 90,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: 15,
    right: 20,
  },
  summaryBackground: {
    width: "99%",
    height: 90,
  },
  zakatAmountText: (color) => ({
    color: color,
    position: "absolute",
    top: 50,
    right: 50,
  }),
  proceedButton: {
    width: "90%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#1F64AA",
    justifyContent: "center",
  },
  proceedButtonText: {
    color: "white",
    textAlign: "center",
    lineHeight: 50,
  },
  table: {
    width: 350,
    marginHorizontal: 10,
  },
  tableBorder: (borderColor) => ({
    borderColor: borderColor,
    borderWidth: 2,
  }),
  head: (secondaryColor) => ({
    height: 40,
    backgroundColor: secondaryColor,
    borderRadius: 10,
  }),
  Tabletext: (color) => ({
    margin: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: color,
  }),
});

export default ZakatCalculatorScreen;
