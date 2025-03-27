import React, { useEffect, useState } from "react";
import { Table, Row, Rows } from "react-native-reanimated-table";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { TablePagination } from "../../components/TablePagination";
import { useCredentials } from "../../context/CredentialsContext";

function paginateData(data, itemsPerPage, currentPage) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}

const BalanceUsesTable = ({ date }) => {
  const { theme } = useTheme();
  const { user } = useCredentials();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Customize the number of items per page as needed

  // Simulate fetching the total records and data
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(tableData.length); // Total records in the dataset

  const tableHead = [
    "تاريخ وتوقيت كل إستعمال",
    "المبلغ المستعمل ",
    "المبلغ المتبقي ",
    "الفرصة المستعمل فيها",
    "حالة الفرصة (مكتملة/غير مكتملة)",
    "إجمالي المبلغ المتبرع به ",
    "نوع العملية",
  ].reverse();

  const fetchTableData = (page) => {
    // Map and filter data based on the date prop
    let data = user.donations
      .filter((item) => item.paymentMethod === "useBalance")
      .map((item) => {
        const timestamp = new Date(item.createdAt);
        let date = timestamp.toISOString().split("T")[0];
        let time = timestamp.toTimeString().split(" ")[0];
        let oppTitle =
          item.donationType === "zakat" || item.donationType === "cart"
            ? "/"
            : item?.donationOpportunity[0]?.title || item?.campaign[0]?.title;
        let status =
          item.donationType === "zakat" || item.donationType === "cart"
            ? "/"
            : item?.donationOpportunity[0]?.progress.rate === 100 ||
              item?.campaign[0]?.progress.rate === 100
            ? "مكتملة"
            : "غير مكتملة";
        return [
          date + "\n" + time,
          item.usedBalance.toFixed(2) + " دج",
          item.remainingAmount.toFixed(2) + " دج",
          oppTitle,
          status,
          item.amount.toFixed(2) + " دج",
          item.donationType === "zakat"
            ? "زكاة"
            : item.donationType === "donationOpportunity"
            ? "فرص تبرع المنصة"
            : item.donationType === "campaign"
            ? "حملة تبرع"
            : item.donationType === "store"
            ? "تبرع للمتجر"
            : item.donationType === "cart"
            ? "سلة التبرع"
            : "",
        ].reverse();
      });
    setTableData(paginateData(data.reverse(), itemsPerPage, currentPage));
    setTotalRecords(data.length);
  };

  useEffect(() => {
    fetchTableData(currentPage);
  }, [currentPage]);

  return (
    <>
      <ScrollView horizontal={true}>
        <View>
          <Table
            style={styles.table}
            borderStyle={styles.tableBorder(theme.borderColor)}
          >
            <Row
              data={tableHead}
              style={styles.head(theme.secondaryColor)}
              textStyle={styles.text()}
              widthArr={[200, 200, 200, 200, 200, 200]}
            />
          </Table>
          <ScrollView>
            <Table
              style={styles.table}
              borderStyle={styles.tableBorder(theme.borderColor)}
            >
              {tableData.map((rowData, index) => (
                <Row
                  key={index}
                  data={rowData}
                  style={[
                    styles.row,
                    index % 2 && { backgroundColor: "#F7F6E7" },
                  ]}
                  textStyle={styles.text()}
                  widthArr={[200, 200, 200, 200, 200, 200]}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      <TablePagination
        totalRecords={totalRecords}
        pageLimit={itemsPerPage}
        pageNeighbours={1}
        currentPage={currentPage}
        onPageChanged={(data) => setCurrentPage(data.currentPage)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  table: {
    marginHorizontal: 10,
  },
  tableBorder: (borderColor) => ({
    borderColor: borderColor,
    borderWidth: 2,
  }),
  head: (secondaryColor) => ({
    height: 40,
    backgroundColor: secondaryColor,
  }),
  text: (color) => ({
    margin: 6,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: color,
  }),
  row: { height: 60, backgroundColor: "#E7E6E1" },
});

export default BalanceUsesTable;
