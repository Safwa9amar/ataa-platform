"use client";

import { useEffect, useState } from "react";
import { Spinner, Typography, Card } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useCredentials } from "@/context/CredentialsContext";
import Link from "next/link";
import { deleteInvoice, getAllInvoices } from "@/services/InvoiceCharityServices";
import UILoading from "@/components/UI/Loading";

export default function InvoicesTable() {
  const { userToken } = useCredentials();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAllInvoices({}, userToken);
        setInvoices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteInvoice(id, userToken);
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <UILoading  />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="red" className="text-center mt-4">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-max table-auto text-right">
        <thead>
          <tr>
            {[
              "رقم الفاتورة",
              "الجهة المصدرة أو المستفيدة",
              "المبلغ (دج)",
              "تاريخ الإصدار",
              "تاريخ الدفع",
              "حالة الدفع",
              "ملاحظات",
              "Actions",
            ].map((head) => (
              <th
                key={head}
                className="border-b border-borderColor bg-blue-gray-50 dark:bg-blue-gray-500 dark:border-blue-gray-700 dark:text-blue-gray-400 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="leading-none font-bold dark:text-gray-200"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr
              key={invoice.id}
              className="even:bg-blue-gray-50/50 dark:even:bg-blue-gray-500 dark:odd:bg-blue-gray-800 text-textColor"
            >
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {invoice.invoiceNumber || "N/A"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {invoice.issuerBeneficiary || "N/A"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {invoice.invoiceAmount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "DZD",
                  })}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {invoice.paymentDate
                    ? new Date(invoice.paymentDate).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {invoice.paymentStatus === "PAID"
                    ? "تم الدفع"
                    : invoice.paymentStatus === "PENDING"
                    ? "مؤجل"
                    : "لم يتم الدفع"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {invoice.notes || "N/A"}
                </Typography>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboards/charity/Expenses/invoice-table/${invoice.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {invoices.length === 0 && (
        <Typography variant="small" className="text-center p-4">
          لا توجد فواتير مسجلة.
        </Typography>
      )}
    </Card>
  );
}