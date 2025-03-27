"use client";
import { useZakat } from "@/context/ZakatContext";
import { Button, IconButton } from "@material-tailwind/react";
import React from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { PiQuotesDuotone } from "react-icons/pi";

export default function ZakatCalculatorHistory() {
  const { zakatData, deleteZakat } = useZakat();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-right mb-4"> حاسبة الزكاة</h1>
      <p className="text-lg text-gray-700 mb-6 text-right leading-relaxed">
        مرحبًا بك في صفحة حاسبة الزكاة! <br />
        من خلال حاسبة الزكاة، يمكنك حساب المبالغ المستحقة بسهولة بناءً على أنواع
        الزكاة المختلفة، سواء كانت زكاة المال، الذهب، الأسهم، أو غيرها. <br />
        يتم حفظ السجل هنا لتتمكن من مراجعة مبالغ الزكاة التي قمت بحسابها أو
        تعديلها إذا لزم الأمر.
      </p>

      {zakatData.length === 0 ? (
        <p className="text-center text-gray-500">
          لا توجد أي مدخلات في السجل حاليًا. قم بإضافة زكاة جديدة.
        </p>
      ) : (
        <table
          className="w-full min-w-max table-auto text-right border-collapse border border-borderColor rounded-lg"
          dir="rtl"
        >
          <thead>
            <tr>
              <th className="border border-borderColor bg-mangoBlack  p-4">
                نوع الزكاة
              </th>
              <th className="border border-borderColor bg-mangoBlack p-4">
                القيمة (دج)
              </th>
              <th className="border border-borderColor bg-mangoBlack p-4">
                خيارات
              </th>
            </tr>
          </thead>
          <tbody>
            {zakatData.map((item, idx) => (
              <tr
                key={idx}
                className="odd:bg-gray-50 odd:dark:bg-gray-600 even:bg-white even:dark:bg-gray-900 hover:bg-blue-50  text-textColor"
              >
                <td className="border border-borderColor p-4">
                  {item.ar_name}
                </td>
                <td className="border border-borderColor p-4">
                  {item.amount} دج
                </td>
                <td className="border border-borderColor p-4 text-center">
                  <IconButton
                    color="red"
                    variant="outlined"
                    onClick={() => deleteZakat(idx)}
                    title="حذف"
                  >
                    <MdOutlineDeleteForever size={26} />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="text-sm text-gray-500 mt-6 text-center flex flex-col">
        <PiQuotesDuotone size={20} />* تذكر أن الزكاة واجب ديني يساهم في تعزيز
        التكافل الاجتماعي ودعم المحتاجين.
        <PiQuotesDuotone className="self-end" size={20} />
      </p>
    </div>
  );
}
