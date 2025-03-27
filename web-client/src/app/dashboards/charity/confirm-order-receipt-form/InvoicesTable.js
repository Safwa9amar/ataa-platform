"use client";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import {
  ButtonGroup,
  Chip,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { AiTwotoneEdit } from "react-icons/ai";
import { TbPdf, TbTrashXFilled } from "react-icons/tb";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useCredentials } from "@/context/CredentialsContext";
import dayjs from "dayjs";
import axios from "axios";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { FaFilePdf } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
// import { deleteMyInvoice } from "@/services/invoiceService";

const TABLE_HEAD = [
  "رقم الفاتورة",
  "الرقم التعريفي للفرصة",
  "صادر من",
  "صادر إلى",
  "تاريخ الإصدار",
  "تاريخ الدفع",
  "حالة التأكيد",
  "المبلغ الاجمالي",
  "الخيارات",
];

export function InvoiceTable({
  keywords = "",
  page = 1,
  limit = 10,
  fetchInvoices,
  data,
  isLoading,
  error,
  totalPages,
}) {
  const { userToken } = useCredentials();
  useEffect(() => {
    fetchInvoices();
  }, [keywords, page, limit]);

  const getInvoicePdf = async (id) => {
    let res = await axios.get(
      `${API_ENDPOINTS.DASHBOARDS.confirmInvoice}/pdf/${id}`,
      {
        headers: getCommonHeaders(userToken),
        responseType: "blob",
      }
    );

    // 📄 إنشاء عنوان للملف
    const fileName = `invoice-${id}.pdf`;

    // 🔽 إنشاء رابط لتحميل الملف
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();

    // 🗑️ حذف الرابط بعد الاستخدام
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };
  const confirmInvoice = async (id) => {
    try {
      await Swal.fire({
        title: "هل انت متأكد من تأكيد الطلبية",
        allowEscapeKey: true,
        showCancelButton: true,
        cancelButtonText: "لا",
        confirmButtonText: "موافق",
        preConfirm: async (confirm) => {
          if (confirm) {
            await axios.get(API_ENDPOINTS.DASHBOARDS.confirmInvoice, {
              headers: getCommonHeaders(userToken),
              params: {
                invoiceId: id,
              },
            });
            toast.success("تم تأكيد استلام الطلبية");
            fetchInvoices();
          }
        },
      });
    } catch (error) {
      Swal.fire("حدث خطأ ما اثناء التأكيد يرجى اعادة المحاولة", "", "error");
    }
  };
  if (isLoading) {
    return (
      <div className="w-full h-[20vh] flex justify-center items-center">
        <Spinner className="w-5 h-6" color="teal" />
      </div>
    );
  }

  if (error) {
    return <DataFetchError error={error} onRetry={fetchInvoices} />;
  }

  return (
    <section className="w-full text-right space-y-5 my-5" dir="rtl">
      <div className="h-full w-full overflow-scroll border border-borderColor bg-mangoBlack rounded-lg px-6">
        <table className="w-full">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-borderColor pb-4 pt-10"
                >
                  <Typography
                    variant="small"
                    className="font-bold leading-none text-textColor"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((invoice) => {
              const {
                id,
                issuedBySupplier,
                issuedToCharity,
                amount,
                issueDate,
                paymentDate,
                confirmationStatus,
                donationOpportunityId,
              } = invoice;
              return (
                <tr
                  key={id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-bold text-textColor"
                    >
                      {id}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {donationOpportunityId || "لا يوجد"}
                    </Typography>
                  </td>

                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {issuedBySupplier}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {issuedToCharity}
                    </Typography>
                  </td>

                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {dayjs(issueDate).format("YYYY/MM/DD")}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {dayjs(paymentDate).format("YYYY/MM/DD") || "غير مدفوع"}
                    </Typography>
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Chip
                      variant="outlined"
                      color={
                        confirmationStatus === "CONFIRMED_PLATFORM"
                          ? "green"
                          : confirmationStatus === "CONFIRMED_CHARITY"
                          ? "red"
                          : "amber"
                      }
                      className="text-center font-ElMessiri w-fit"
                      value={
                        confirmationStatus === "CONFIRMED_CHARITY"
                          ? "تم التأكيد بواسطة المستلم"
                          : confirmationStatus === "CONFIRMED_PLATFORM"
                          ? "تم التأكيد بواسطة المنصة"
                          : "معلقة"
                      }
                    />
                  </td>
                  <td className="py-4 border-b border-borderColor">
                    <Typography
                      variant="small"
                      className="font-normal text-textColor"
                    >
                      {amount} دج
                    </Typography>
                  </td>
                  <td
                    dir="ltr"
                    className="py-4 border-b border-borderColor flex justify-end"
                  >
                    <div className="flex gap-2">
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => getInvoicePdf(id)}
                      >
                        <FaFilePdf size={20} />
                      </IconButton>
                      <IconButton
                        disabled={
                          confirmationStatus === "CONFIRMED_CHARITY" ||
                          confirmationStatus === "CONFIRMED_PLATFORM"
                        }
                        color={
                          confirmationStatus === "CONFIRMED_CHARITY" ||
                          confirmationStatus === "CONFIRMED_PLATFORM"
                            ? "green"
                            : "blue-gray"
                        }
                        variant="text"
                        onClick={() => confirmInvoice(id)}
                      >
                        <FaCheckCircle size={20} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
