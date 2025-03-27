"use client";
import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { usePathname, useRouter } from "next/navigation";
import {
  DocumentPlusIcon, // For forms
  TableCellsIcon, // For tables
  CurrencyDollarIcon, // For incomes
  ReceiptPercentIcon, // For expenses
  ClipboardDocumentListIcon, // For invoices
} from "@heroicons/react/24/solid";

const data = [
  {
    label: "نموذج ادخال بيانات الايرادات",
    value: "incomes-form",
    href: "/dashboards/charity/Expenses/incomes-form",
    icon: <CurrencyDollarIcon className="h-5 w-5 mr-2" />,
  },
  {
    label: "نموذج ادخال بيانات النفقات",
    value: "exprenses-form",
    href: "/dashboards/charity/Expenses/exprenses-form",
    icon: <ReceiptPercentIcon className="h-5 w-5 mr-2" />,
  },
  {
    label: "نموذج متابعة الفواتير والمدفوعات",
    value: "invoice-form",
    href: "/dashboards/charity/Expenses/invoice-form",
    icon: <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />,
  },
  {
    label: "جدول بيانات الايرادات",
    value: "incomes-table",
    href: "/dashboards/charity/Expenses/incomes-table",
    icon: <TableCellsIcon className="h-5 w-5 mr-2" />,
  },
  {
    label: "جدول بيانات النفقات",
    value: "expenses-table",
    href: "/dashboards/charity/Expenses/expenses-table",
    icon: <TableCellsIcon className="h-5 w-5 mr-2" />,
  },
  {
    label: "جدول البيانات المالية",
    value: "invoice-table",
    href: "/dashboards/charity/Expenses/invoice-table",
    icon: <TableCellsIcon className="h-5 w-5 mr-2" />,
  },
];

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className=" mx-auto h-screen w-screen p-4 lg:p-10" dir="rtl">
      {/* Grid layout for larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.5fr_2fr] gap-5">
        {/* Navigation Sidebar */}
        <div className="flex flex-wrap md:flex-col gap-5 bg-mangoBlack rounded-lg p-5 ">
          {data.map(({ label, value, href, icon }) => (
            <Button
              variant={pathname.startsWith(href) ? "gradient" : "text"}
              color="teal"
              className="font-ElMessiri rounded-full flex items-center gap-2"
              size="md"
              onClick={() => router.push(href)}
              key={value}
            >
              {icon} {/* Render the icon */}
              <span className="truncate">{label}</span> {/* Truncate long text */}
            </Button>
          ))}
        </div>

        {/* Main Content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}