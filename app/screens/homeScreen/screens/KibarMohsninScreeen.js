import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useLayoutEffect, memo } from "react";
import Text from "../../../components/Text";
import { useTheme } from "../../../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../../../navigation/CustomHeader";
import RankIcons from "../../../components/RankIcons";
import SearchBar from "../../../components/SearchBar";
import TypingText from "../../../components/TypingText";
import PeriodFilter from "../../../components/PeriodFilter";
import { useKibarMohsnin } from "../../../context/KibarMohsninContext";
import RenderTableItemSkeleton from "../../../components/skeleton/RenderTableItemSkeleton";
import numbro from "numbro";
import Unlogged from "../../../components/Unlogged";
const KibarMohsninScreen = () => {
  const { theme } = useTheme();
  const { loading, fetchData, data, setKeyword, setPeriod } = useKibarMohsnin();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.getParent().setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchData} />
      }
    >
      <View style={styles.headerContainer}>
        <Image
          style={styles.headerImage}
          source={require("../../../assets/images/charityday.jpg")}
        />
        <View style={styles.headerOverlay}>
          <CustomHeader />
          <Text
            style={{ ...styles.headerText, color: theme.secondaryColor }}
            type="headingSmall"
          >
            كبار المحسنين
          </Text>
          <TypingText
            textSize="sm"
            color={theme.secondaryColor}
            text="مؤسسات وأفراد ساهموا بسخاء في مختلف ميادين الخير والعطاء."
          />

          <SearchBar
            placeholderText="بحث ..."
            align="center"
            width="100%"
            fetchDataCallback={setKeyword}
          />
          <PeriodFilter onDateSelected={setPeriod} />
        </View>
      </View>
      <TableData loading={loading} data={data} />
    </ScrollView>
  );
};

const TableData = ({ data, loading }) => {
  const { theme } = useTheme();
  const RenderTableItem = memo(({ item }) => (
    <View style={styles.tableRow(theme.steel, theme.backgroundColor)}>
      <RankIcons rank={item.topDonorRank} />
      <Text style={styles.tableText}>
        {numbro(item.totalDonatedAmount).format({
          output: "currency",
          thousandSeparated: true,
          currencySymbol: "دج",
          currencyPosition: "postfix",
          spaceSeparated: true,
          mantissa: 2,
        })}
      </Text>
      <Text style={styles.tableText}>{item.name}</Text>
    </View>
  ));

  return (
    <>
      <View style={{ ...styles.header, backgroundColor: theme.secondaryColor }}>
        <Text color="white" type="md">
          {"التصنيف"}
        </Text>
        <Text color="white" type="md">
          {"المبلغ"}
        </Text>
        <Text color="white" type="md">
          {"المتبرع"}
        </Text>
      </View>
      {loading ? (
        <ScrollView style={styles.scrollContainer}>
          <RenderTableItemSkeleton />
          <RenderTableItemSkeleton />
          <RenderTableItemSkeleton />
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <RenderTableItem item={item} key={index} />
            ))
          ) : (
            <View style={{ alignSelf: "center", alignItems: "center" }}>
              <Image
                style={{ width: 350, height: 300 }}
                source={require("../../../assets/images/nodata.png")}
              />
              <Text type="md">لا توجد بيانات </Text>
            </View>
          )}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 300,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  headerOverlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000000BF",
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 100,
  },
  headerText: {
    fontSize: 24,
  },

  searchFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    position: "relative",
  },
  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  tableRow: (borderClr, bgClr) => ({
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: borderClr,
    backgroundColor: bgClr,
  }),
  tableText: {
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    position: "sticky",
    top: -50,
    zIndex: 1,
  },
  scrollContainer: {
    position: "sticky",
    top: -50,
    zIndex: 1,
  },
});

export default KibarMohsninScreen;
