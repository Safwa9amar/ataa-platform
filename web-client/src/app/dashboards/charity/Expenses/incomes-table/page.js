"use client";

import { useEffect, useState } from "react";
import { Spinner, Typography, Card } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useCredentials } from "@/context/CredentialsContext";
import { deleteIncome, getAllIncomes } from "@/services/IncomeCharityServices";
import Link from "next/link";
import UILoading from "@/components/UI/Loading";

export default function IncomesTable() {
  const { userToken } = useCredentials();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const data = await getAllIncomes({}, userToken);
        setIncomes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id, userToken);
      setIncomes((prev) => prev.filter((income) => income.id !== id));
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
            {["المصدر", "المبلغ (دج)", "التاريخ", "محلاظات", "Actions"].map(
              (head) => (
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
              )
            )}
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr
              key={income.id}
              className="even:bg-blue-gray-50/50 dark:even:bg-blue-gray-500 dark:odd:bg-blue-gray-800 text-textColor"
            >
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {income.source === "DONATION"
                    ? "تبرعات"
                    : income.source === "SALES"
                    ? "مبيعات"
                    : income.source === "GOVERNMENT_SUPPORT"
                    ? "دعم حكومي"
                    : income.source === "GRANT"
                    ? "منح"
                    : "اخرى"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {income.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "DZD",
                  })}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {new Date(income.receiptDate).toLocaleDateString()}
                </Typography>
              </td>
              <td className="p-4">
                <Typography variant="small" className="font-normal">
                  {income.notes || "N/A"}
                </Typography>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Link
                    href={`/dashboards/charity/Expenses/incomes-table/${income.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(income.id)}
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
      {incomes.length === 0 && (
        <Typography variant="small" className="text-center p-4">
          No income records found.
        </Typography>
      )}
    </Card>
  );
}
