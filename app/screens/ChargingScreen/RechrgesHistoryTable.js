import React, { memo, useEffect, useState } from "react";
import { Table, Row, Rows } from "react-native-reanimated-table";
import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { TablePagination } from "../../components/TablePagination";
import { useCredentials } from "../../context/CredentialsContext";

function filterDataByDate(data, date) {
  // Format date to match the date in the data
  if (!date) return;
  const formattedDate = date.toISOString().split("T")[0];
  return data.filter((item) => item[1] === formattedDate);
}

function paginateData(data, itemsPerPage, currentPage) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}

const RechrgesHistoryTable = ({ date }) => {
  const { theme } = useTheme();
  const { user } = useCredentials();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Map and filter data based on the date prop
  let data = user.recharges
    .map((item) => {
      const timestamp = new Date(item.createdAt);
      let date = timestamp.toISOString().split("T")[0];
      let time = timestamp.toTimeString().split(" ")[0];
      return [item.amount, date, time, item.points];
    })
    .reverse();

  // Filter data based on the date prop
  const filteredData = date ? filterDataByDate(data, date) : data;
  const [tableData, setTableData] = useState(
    paginateData(filteredData, itemsPerPage, currentPage)
  );

  const tableHead = [
    "القيمة بالنقاط",
    "التاريخ",
    "التوقيت",
    `الرصيد (${process.env.APP_CURRENCY_NAME})`,
  ];

  useEffect(() => {
    // Update table data and reset to first page whenever date changes
    if (date) {
      setTableData(paginateData(filteredData, itemsPerPage, 1));
      setCurrentPage(1);
    }
  }, [date]);

  useEffect(() => {
    // Update table data when page changes
    setTableData(paginateData(filteredData, itemsPerPage, currentPage));
  }, [currentPage, user.recharges]);

  return (
    <>
      <Table
        style={styles.table}
        borderStyle={styles.tableBorder(theme.borderColor)}
      >
        <Row
          data={tableHead}
          style={styles.head(theme.secondaryColor)}
          textStyle={styles.text()}
        />
      </Table>
      <Rows data={tableData} textStyle={styles.text(theme.textColor)} />
      <TablePagination
        totalRecords={filteredData.length}
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
});

export default RechrgesHistoryTable;
