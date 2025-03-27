"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useZakat } from "@/context/ZakatContext";
import Image from "next/image";
import { FaCircleInfo, FaMoneyBills } from "react-icons/fa6";
import { Alert, Button } from "@material-tailwind/react";
import { AiOutlineGold } from "react-icons/ai";
import { FaChartLine, FaHistory } from "react-icons/fa";
import { FcCalculator } from "react-icons/fc";
import UILoading from "@/components/UI/Loading";
import CONSTANTS from "@/config/constants";
import Swal from "sweetalert2";
import { getZakatRepport } from "@/services/repportsService";
import { useCredentials } from "@/context/CredentialsContext";

export default function Layout({ children }) {
  const { totalAmount } = useZakat();
  const { isLoggedIn, userToken, user } = useCredentials();
  const isZakatPayed =
    user?.zakat?.length > 0 &&
    user.zakat.some((el) => el.year === new Date().getFullYear());
  let currentYearZakat = user?.zakat?.find(
    (el) => el.year === new Date().getFullYear()
  );
  const pathname = usePathname();

  const navItems = [
    {
      href: "/our-programmes/zakat/calculate",
      label: "سجل الحاسبة",
      icon: <FcCalculator color="#28A745" size={26} />,
    },
    {
      href: "/our-programmes/zakat/calculate/el-mal",
      label: "زكاة الأموال",
      icon: <FaMoneyBills color="#28A745" size={26} />,
    },
    {
      href: "/our-programmes/zakat/calculate/gold",
      label: "زكاة الذهب",
      icon: <AiOutlineGold color="#FFD700" size={26} />,
    },
    {
      href: "/our-programmes/zakat/calculate/silver",
      label: "زكاة الفضة",
      icon: <AiOutlineGold color="#C0C0C0" size={26} />,
    },
    {
      href: "/our-programmes/zakat/calculate/stocks",
      label: "زكاة الأسهم",
      icon: <FaChartLine size={26} />,
    },
  ];

  const handleDownloadReport = async () => {
    try {
      if (!isLoggedIn) {
        return Swal.fire({
          title: "يجب عليك تسجيل الدخول لحسابك حتى تتمكن من مراجعة التقرير",
          icon: "info",
          confirmButtonText: "حسنًا",
        });
      }

      // Show date selection dialog
      const { value: selectedYear } = await Swal.fire({
        title: "اختر الفترة الزمنية",
        input: "range",
        inputLabel: "اختر السنة",
        inputAttributes: {
          min: "2020",
          max: String(new Date().getFullYear()),
          step: "1",
        },
        confirmButtonText: "تحميل التقرير",
        showCancelButton: true,
      });

      if (!selectedYear) return; // User canceled

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
      await getZakatRepport(selectedYear, userToken);

      // Show success message
      Swal.fire("تم بنجاح!", `تم تحميل تقرير سنة ${selectedYear}.`, "success");
    } catch (error) {
      console.error("Error downloading report:", error.message);

      // Show error message
      Swal.fire("خطأ", "فشل تحميل التقرير.", "error");
    }
  };

  return (
    <main className="flex flex-col lg:grid lg:grid-cols-5 lg:grid-rows-5 gap-2 px-2">
      <nav className="flex flex-wrap items-center justify-end pr-5 md:pr-10 col-span-5 row-start-1 row-end-2">
        {/* Container for Navigation Items */}
        <div className="flex flex-wrap sm:gap-5  items-center justify-end gap-3 w-full md:w-auto">
          {navItems.reverse().map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex justify-center gap-2 w-fit py-2 px-5 text-white text-sm scale-95 hover:scale-100 transition-transform duration-200 rounded-full ${
                pathname === item.href
                  ? "bg-gradient-to-tl from-primaryColorDark to-secondaryColorDark "
                  : "bg-gray-500"
              }`}
            >
              <p className="text-base md:text-lg">{item.label}</p>
              {item.icon}
            </Link>
          ))}
        </div>
      </nav>

      <aside className="flex flex-col items-center col-start-1 col-span-2 row-start-2 row-end-6 bg-gray-200 dark:bg-gray-800 dark:bg-opacity-55 rounded-lg">
        <Image
          src={"/images/image48.png"}
          width={300}
          height={300}
          alt="زكاة"
        />
        <div className="p-5 flex flex-col items-center gap-2 min-w-[450px] min-h-[120px] bg-cover bg-no-repeat bg-[url(/images/Frame__274.png)] dark:bg-[url(/images/Frame_274_dark.png)]">
          <p className="border-b border-steel">إجمال الزكاة المستحقة</p>
          <p>{totalAmount}</p>
          <p>دينار جزائري</p>
        </div>
        {isZakatPayed && (
          <Alert
            className="flex gap-3 text-right max-w-[450px] my-5"
            icon={<FaCircleInfo />}
            color="blue"
          >
            <p>لقد قمت بتسجيل الزكاة للسنة الحالية نشكرك على وفائك وعطائك</p>
            <p>قدر مبلغ زكاتك ب : {currentYearZakat.zakatTotal} دج</p>
          </Alert>
        )}
        <div className="flex flex-wrap gap-2 p-2">
          {user?.zakat?.length > 0 && (
            <Button
              variant="gradient"
              color="amber"
              className="rounded-full"
              onClick={handleDownloadReport}
            >
              عرض التقرير
            </Button>
          )}
          {!isZakatPayed && (
            <Link
              href={`/donate-now?type=${CONSTANTS.DONATION_TYPES.ZAKAT}&price=${totalAmount}&isCalculatedZakat=true`}
            >
              <Button variant="gradient" color="green" className="rounded-full">
                متابعة الدفع
              </Button>
            </Link>
          )}
        </div>
      </aside>

      <div className="col-start-3 col-span-3 row-start-2 row-end-6 bg-gray-50 dark:bg-gray-800 dark:bg-opacity-55 rounded-lg p-10">
        <Suspense fallback={<UILoading />}>{children}</Suspense>
      </div>
    </main>
  );
}
