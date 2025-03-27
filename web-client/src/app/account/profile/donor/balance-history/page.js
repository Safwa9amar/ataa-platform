"use client";
import React, { useEffect, useState } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { Button, Typography } from "@material-tailwind/react";
import TablePagination from "@/components/UI/TablePagination";
import Swal from "sweetalert2";
import { getUserBalanceRepports } from "@/services/repportsService";

function filterDataByDate(data, date) {
  if (!date) return data;
  const formattedDate = date.toISOString().split("T")[0];
  return data.filter((item) => item[1] === formattedDate);
}

function paginateData(data, itemsPerPage, currentPage) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}

const RechargeHistoryPage = ({ date }) => {
  const { user, userToken } = useCredentials();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const tableHead = ["القيمة بالنقاط", "التاريخ", "التوقيت", `الرصيد (دج)`];

  // Prepare and filter recharge data based on the date prop
  let data = user.recharges
    ? user.recharges
        ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by createdAt
        ?.map((item) => {
          const timestamp = new Date(item.createdAt);
          const date = timestamp.toISOString().split("T")[0];
          const time = timestamp.toTimeString().split(" ")[0];
          return [item.points, date, time, item.amount.toFixed(2)];
        })
        .reverse()
    : [];

  const filteredData = date ? filterDataByDate(data, date) : data;

  useEffect(() => {
    setTableData(paginateData(filteredData, itemsPerPage, currentPage));
    setTotalRecords(filteredData.length);
  }, [date, currentPage, user.recharges]);

  const handleBalanceUsesReport = async () => {
    try {
      // Prompt date range selection
      const { value: dates } = await Swal.fire({
        title: "اختر الفترة الزمنية",
        html: `
            <label for="from-date">من:</label>
            <input type="date" id="from-date" class="swal2-input">
            <label for="to-date">إلى:</label>
            <input type="date" id="to-date" class="swal2-input">
          `,
        confirmButtonText: "تحميل التقرير",
        showCancelButton: true,
        preConfirm: () => {
          const from = document.getElementById("from-date").value;
          const to = document.getElementById("to-date").value;
          if (!from || !to) {
            Swal.showValidationMessage("الرجاء تحديد التاريخين!");
          }
          return { from, to };
        },
      });

      await getUserBalanceRepports(dates.from, dates.to, userToken);
      Swal.fire("تم بنجاح!", "تم تحميل التقرير.", "success");
    } catch (error) {
      console.error("Error downloading recharge report:", error.message);
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };

  return (
    <div dir="rtl" className="container mx-auto px-6 py-8 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between">
        <Typography className="text-2xl font-semibold mb-8 text-gray-800 dark:text-white">
          سجل عمليات الشحن <sup>({totalRecords} عملية شحن)</sup>
        </Typography>

        <Button
          onClick={handleBalanceUsesReport}
          variant="outlined"
          color="green"
          className="font-ElMessiri hover:bg-secondaryColor hover:text-white"
        >
          عرض التقرير
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              {tableHead.map((head, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-gray-700 dark:text-gray-300 text-center font-semibold text-sm"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  <Typography variant="h6">لا توجد بيانات لعرضها</Typography>
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 text-center text-gray-600 dark:text-gray-300"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TablePagination
        totalRecords={filteredData?.length || 0}
        pageLimit={itemsPerPage}
        pageNeighbours={1}
        currentPage={currentPage}
        onPageChanged={(data) => setCurrentPage(data.currentPage)}
      />
    </div>
  );
};

export default RechargeHistoryPage;
