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
import { FaFilePdf } from "react-icons/fa6";
import API_ENDPOINTS from "@/config/apiEndPoints";
// import { deleteMyInvoice } from "@/services/invoiceService";

const TABLE_HEAD = [
  "رقم الفاتورة",
  "الرقم التعريفي للفرصة",
  "صادر من",
  "صادر إلى",
  "تاريخ الإصدار",
  "تاريخ الدفع",
  "الحالة",
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

  const handleDeleteInvoice = async (id) => {
    await Swal.fire({
      title: "هل أنت متأكد من حذف الفاتورة؟",
      showCloseButton: true,
      showDenyButton: true,
      showConfirmButton: true,
      preConfirm: async () => {
        try {
          // await deleteMyInvoice(id, userToken);
          toast.success("تم حذف الفاتورة بنجاح");
          fetchInvoices();
        } catch (error) {
          toast.error("حدث خطأ، يرجى إعادة المحاولة");
        }
      },
    });
  };

  const getInvoicePdf = async (id) => {
    let res = await axios.get(
      `${API_ENDPOINTS.DASHBOARDS.SUPPLIERS}/generate-invoice-pdf/${id}`,
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
                status,
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
                        status === "PAID"
                          ? "green"
                          : status === "CANCELED"
                          ? "red"
                          : "amber"
                      }
                      className="text-center font-ElMessiri w-fit"
                      value={status}
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
                  <td>
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => getInvoicePdf(id)}
                    >
                      <FaFilePdf size={20} />
                    </IconButton>
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
