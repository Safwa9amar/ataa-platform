"use client";
import CONSTANTS from "@/config/constants";
import { useCredentials } from "@/context/CredentialsContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

function ZakatPaymentPage() {
  const [zakatAmount, setZakatAmount] = useState("");
  const { isLoggedIn, user } = useCredentials();
  const router = useRouter();

  const handleSubmission = () => {
    if (!isLoggedIn) {
      // Show SweetAlert if user is not logged in
      Swal.fire({
        icon: "warning",
        title: "تنبيه",
        text: "يرجى تسجيل الدخول إلى حسابك لتتمكن من إخراج مبلغ الزكاة.",
        confirmButtonText: "تسجيل الدخول",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/account/login");
        }
      });
      return;
    }
    // if (
    //   user.zakat.length > 0 &&
    //   user.zakat.some((el) => el.year === new Date().getFullYear())
    // ) {
    //   let currentYearZakat = user.zakat.find(
    //     (el) => el.year === new Date().getFullYear()
    //   );
    //   return Swal.fire({
    //     title: "لقد قمت باخراج الزكاة للسنة الحالية",
    //     text: `مبلغ زكاتك قدر ب ${currentYearZakat.zakatTotal} دج`,
    //   });
    // }

    if (zakatAmount) {
      // Show success SweetAlert with zakat amount
      Swal.fire({
        icon: "success",
        title: "تم بنجاح",
        text: `تم تسجيل مبلغ الزكاة وسيتم نقلك إلى صفحة التبرع الآن حتى تتمكن من إتمام العملية بنجاح: ${zakatAmount} د.ج. جزاك الله خيرًا!`,
        confirmButtonText: "موافق",
      }).then(() => {
        router.push(
          `/donate-now?type=${CONSTANTS.DONATION_TYPES.ZAKAT}&price=${zakatAmount}`
        );
      });
    } else {
      // Show error SweetAlert if no zakat amount is entered
      Swal.fire({
        icon: "error",
        title: "خطأ",
        text: "من فضلك، أدخل مبلغ الزكاة قبل المتابعة.",
        confirmButtonText: "إغلاق",
      });
    }
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center p-4 min-h-[60vh]"
    >
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        إخراج الزكاة المعلومة
      </h1>
      <div className="bg-mangoBlack shadow-md rounded-lg p-6 w-full max-w-xl">
        <p className="text-gray-700 dark:text-gray-500 text-lg leading-relaxed mb-6">
          قال الله تعالى:{" "}
          <span className="font-semibold text-green-600">
            {"وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ"}
          </span>{" "}
          [البقرة: 43]
        </p>
        <p className="text-gray-700 dark:text-gray-500 text-lg leading-relaxed mb-6">
          الزكاة ركن من أركان الإسلام ووسيلة لتطهير الأموال وتنمية المجتمع. احرص
          على إخراج الزكاة في وقتها ووفقًا لمقدارها المستحق.
        </p>
        <label className="block text-right mb-2 text-gray-600">
          أدخل مبلغ الزكاة المستحقة:
        </label>
        <input
          type="number"
          value={zakatAmount}
          onChange={(e) => setZakatAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300"
          placeholder="أدخل المبلغ بالدينار الجزائري"
        />
        <button
          onClick={handleSubmission}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          إخراج الزكاة
        </button>
      </div>
    </div>
  );
}

export default ZakatPaymentPage;
