"use client";
import React, { useEffect, useState } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { Button, Typography } from "@material-tailwind/react";
import TablePagination from "@/components/UI/TablePagination";
import Swal from "sweetalert2";
import { getUserBalanceRepports } from "@/services/repportsService";

function paginateData(data, itemsPerPage, currentPage) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}

const BalanceUsesPage = () => {
  const { user, userToken } = useCredentials();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const tableHead = [
    "تاريخ وتوقيت كل إستعمال",
    "المبلغ المستعمل",
    "المبلغ المتبقي",
    "الفرصة المستعمل فيها",
    "حالة الفرصة (مكتملة/غير مكتملة)",
    "إجمالي المبلغ المتبرع به",
    "نوع العملية",
  ];

  const fetchTableData = () => {
    if (!user?.donations) return;
    let data = user.donations
      ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Sort by createdAt

      // Filter and format data
      .filter((item) => item.paymentMethod === "useBalance")
      .map((item) => {
        const timestamp = new Date(item.createdAt);
        const date = timestamp.toISOString().split("T")[0];
        const time = timestamp.toTimeString().split(" ")[0];
        const oppTitle =
          item.donationType === "zakat" || item.donationType === "cart"
            ? "/"
            : item?.donationOpportunity?.title || item?.campaign?.title;
        const status =
          item.donationType === "zakat" || item.donationType === "cart"
            ? "/"
            : item?.donationOpportunity?.progress.rate === 100 ||
              item?.campaign?.progress.rate === 100
            ? "مكتملة"
            : "غير مكتملة";
        return [
          `${date} ${time}`,
          `${item.usedBalance.toFixed(2)} دج`,
          `${item.remainingAmount.toFixed(2)} دج`,
          oppTitle,
          status,
          `${item.amount.toFixed(2)} دج`,
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
        ];
      });

    setTableData(paginateData(data.reverse(), itemsPerPage, currentPage));
    setTotalRecords(data.length);
  };

  const handleRechargesReport = async () => {
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

      if (!dates) return; // If the user cancels, exit the function

      // Show loading Swal
      Swal.fire({
        title: "جاري تحميل التقرير...",
        text: "يرجى الانتظار",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });

      // Fetch report
      await getUserBalanceRepports(dates.from, dates.to, userToken);

      // Show success message
      Swal.fire("تم بنجاح!", "تم تحميل التقرير.", "success");
    } catch (error) {
      console.error("Error downloading recharge report:", error.message);

      // Show error message
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [currentPage]);

  return (
    <div dir="rtl" className="container mx-auto px-6 py-8 dark:bg-gray-800">
      <div className="flex flex-wrap items-center justify-between">
        <Typography
          variant="h2"
          className="text-3xl font-semibold mb-8 text-gray-800 dark:text-white"
        >
          سجل استخدام الرصيد <sup>({totalRecords} عملية شحن)</sup>
        </Typography>

        <Button
          onClick={handleRechargesReport}
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
                  colSpan={7}
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
        totalRecords={totalRecords}
        pageLimit={itemsPerPage}
        pageNeighbours={1}
        currentPage={currentPage}
        onPageChanged={(data) => setCurrentPage(data.currentPage)}
      />
    </div>
  );
};

export default BalanceUsesPage;
