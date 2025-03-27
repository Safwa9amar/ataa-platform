import React from "react";
import { TransactionsTable } from "./Table";
import { Suspense } from "react";

export const metadata = {
  title: "قائمة كبار المحسنين",
};

export default function page() {
  return (
    <div
      dir="rtl"
      className="container flex flex-col self-center gap-5 px-5 py-10 text-textColor"
    >
      <h1 className="text-3xl">كبار المحسنين</h1>
      <p className="text-xl">
        قائمة كبار المحسنين والافراد الذين تبرعوا في مختلف مجالات الخير والعطاء
      </p>
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <TransactionsTable />
      </Suspense>
    </div>
  );
}
