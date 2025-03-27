"use client";
import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import TablePagination from "@/components/UI/TablePagination";
import { useCredentials } from "@/context/CredentialsContext";
import Swal from "sweetalert2";
import { getDonationsRepports } from "@/services/repportsService";

function paginateData(data, itemsPerPage, currentPage) {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return data.slice(start, end);
}

const DonationHistoryPage = () => {
  const { user, userToken } = useCredentials();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Customize the number of items per page as needed
  const [tableData, setTableData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const tableHead = [
    "المبلغ المتبرع به",
    "تاريخ وتوقيت كل تبرع",
    "الفرصة المتبرع فيها",
    "حالة الفرصة (مكتملة/غير مكتملة)",
    "نوع العملية",
  ];

  const fetchTableData = () => {
    if (!user?.donations) return;
    let data = user.donations
      // sort based on date
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((item) => item.paymentMethod !== "useBalance")
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
          `${item.amount.toFixed(0)} دج`,
          `${date} ${time}`,
          oppTitle,
          status,
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
    setTableData(paginateData(data, itemsPerPage, currentPage));
    setTotalRecords(data.length);
  };

  useEffect(() => {
    fetchTableData();
  }, [currentPage]);

  const handleDonationsReport = async () => {
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
      await getDonationsRepports(dates.from, dates.to, userToken);

      // Show success message
      Swal.fire("تم بنجاح!", "تم تحميل التقرير.", "success");
    } catch (error) {
      console.error("Error downloading donations report:", error.message);

      // Show error message
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };

  return (
    <div dir="rtl" className="container mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between">
        <Typography
          variant="h2"
          className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-300"
        >
          سجل التبرعات
        </Typography>

        <Button
          onClick={handleDonationsReport}
          variant="outlined"
          color="green"
          className="font-ElMessiri hover:bg-secondaryColor hover:text-white"
        >
          عرض التقرير
        </Button>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-mangoBlack shadow-md rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr>
              {tableHead.map((head, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-gray-600 text-center font-bold"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  <Typography variant="h6" className="text-gray-500">
                    لا توجد بيانات لعرضها
                  </Typography>
                </td>
              </tr>
            ) : (
              tableData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "bg-mangoBlack"
                  }`}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-center text-textColor"
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

export default DonationHistoryPage;
