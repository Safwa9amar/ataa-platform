import React from "react";
import { Suspense } from "react";
import { DataTable } from "./DataTable";

export default function page() {
  return (
    <div
      dir="rtl"
      className="container self-center flex flex-col gap-5 px-5 py-10 text-textColor"
    >
      <h1 className="text-3xl">سفراء عطاء</h1>
      <p className="text-xl">
        خدمة تتيح لنشر فرص التبرع عبرا وسائل التواصل وكسب نقاط من التبرعات التي
        قام بن الأخرين عي طريق نشرك{" "}
      </p>
      <Suspense fallback={<p>جاري التحميل...</p>}>
        <DataTable />
      </Suspense>
    </div>
  );
}
