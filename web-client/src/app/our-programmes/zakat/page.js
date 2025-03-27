"use client";
import Link from "next/link";
import React from "react";
import { BiSolidCalculator, BiSolidQuoteAltLeft } from "react-icons/bi";
import { FaDonate } from "react-icons/fa";
import { Button } from "@material-tailwind/react";

export default function Page() {
  return (
    <main className="flex flex-col items-center p-5 gap-10" dir="rtl">
      {/* Hero Section */}
      <section className="w-full max-w-screen-lg flex flex-col md:flex-row items-center gap-6 bg-gray-50 bg-opacity-70 text-textColor dark:bg-gray-800 rounded-2xl p-6 shadow-md">
        <div className="flex-1 text-center md:text-right">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            أهلاً بك في حاسبة الزكاة
          </h1>
          <p className="text-sm md:text-base leading-relaxed mb-4 dark:text-gray-300">
            احسب زكاتك وأخرجها بسهولة وأمان لمستحقيها عبر منصتنا. نقدم لك
            الأدوات اللازمة لتوفير وقتك وجهدك.
          </p>
          {/* <div className="flex gap-4 justify-center md:justify-start">
            <Link href="./zakat/calculate">
              <Button
                variant="gradient"
                color="green"
                className="rounded-full py-2 px-6 text-sm font-semibold"
                aria-label="Navigate to Zakat Calculator"
              >
                احسب زكاتك
              </Button>
            </Link>
            <Link href="./zakat/direct">
              <Button
                variant="gradient"
                color="blue"
                className="rounded-full py-2 px-6 text-sm font-semibold"
                aria-label="Navigate to Direct Zakat Payment"
              >
                ادفع زكاتك
              </Button>
            </Link>
          </div> */}
        </div>
        <div className="flex-1 hidden md:block">
          {/* Placeholder for an image or illustration */}
          <img
            src={
              "https://cdni.iconscout.com/illustration/premium/thumb/les-musulmans-donnant-zakat-7224385-5899128.png?f=webp"
            }
            alt="Zakat Hero Image"
            className="w-full max-w-sm mx-auto rounded-lg"
          />
        </div>
      </section>

      {/* Cards Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-screen-lg">
        {/* Zakat Calculator Card */}
        <div className="flex flex-col items-center gap-4 bg-primaryColorDark bg-opacity-90 dark:bg-gray-800 rounded-3xl p-6 text-white dark:text-gray-300 shadow-lg scale-100 hover:scale-105 transition-transform duration-200 w-full">
          <BiSolidCalculator
            size={50}
            className="shadow-inner p-1 rounded-md bg-white bg-opacity-20 dark:bg-gray-700"
            aria-label="Calculator Icon"
          />
          <h2 className="text-lg md:text-xl font-semibold">حاسبة الزكاة</h2>
          <p className="text-center text-sm md:text-base leading-relaxed">
            قم بحساب مقدار الزكاة الواجب عليك دفعه بناءً على نوع المال الذي
            تملكه.
          </p>
          <Link href="./zakat/calculate">
            <Button
              variant="gradient"
              color="green"
              className="rounded-full py-2 px-6 mt-2 text-sm font-semibold hover:shadow-lg"
              aria-label="Navigate to Zakat Calculator"
            >
              احسب زكاتك الآن
            </Button>
          </Link>
        </div>

        {/* Zakat Donation Card */}
        <div className="flex flex-col items-center gap-4 bg-primaryColorDark bg-opacity-90 dark:bg-gray-800 rounded-3xl p-6 text-white dark:text-gray-300 shadow-lg scale-100 hover:scale-105 transition-transform duration-200 w-full">
          <FaDonate
            size={50}
            className="shadow-inner p-1 rounded-md bg-white bg-opacity-20 dark:bg-gray-700"
            aria-label="Donate Icon"
          />
          <h2 className="text-lg md:text-xl font-semibold">اخراج الزكاة</h2>
          <p className="text-center text-sm md:text-base leading-relaxed">
            ادفع مبلغ الزكاة المستحق مباشرة، بطريقة آمنة وسريعة تضمن وصولها إلى
            مستحقيها.
          </p>
          <Link href="./zakat/direct">
            <Button
              variant="gradient"
              color="green"
              className="rounded-full py-2 px-6 mt-2 text-sm font-semibold hover:shadow-lg"
              aria-label="Navigate to Direct Zakat Payment"
            >
              اخرج زكاتك الآن
            </Button>
          </Link>
        </div>
      </section>
      {/* Additional Information Section */}
      <section className="w-full max-w-screen-lg bg-gray-100 dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          لماذا إخراج الزكاة؟
        </h3>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          الزكاة ليست مجرد واجب ديني، بل هي وسيلة لتحقيق التوازن الاجتماعي
          والاقتصادي. من خلال إخراج الزكاة:
        </p>
        <ul className="list-disc list-inside text-sm md:text-base text-gray-700 dark:text-gray-300 mt-4">
          <li>تساهم في دعم الأسر المحتاجة.</li>
          <li>تعزز شعور التضامن بين أفراد المجتمع.</li>
          <li>تحقق البركة في مالك وتطهره.</li>
        </ul>
        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mt-4">
          لمزيد من التفاصيل حول أحكام الزكاة وفوائدها، يمكنك زيارة{" "}
          <Link
            href="https://www.example.com"
            className="text-green-600 dark:text-green-400 hover:underline"
          >
            هذه الصفحة
          </Link>
          .
        </p>
      </section>

      {/* Quote Section */}
      <section
        className="flex flex-col items-center gap-6 text-center w-full max-w-screen-lg p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md"
        dir="rtl"
      >
        <BiSolidQuoteAltLeft
          size={50}
          color="green"
          aria-label="Quote Icon"
          className="opacity-75 self-start"
        />
        <p className="text-sm md:text-lg font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
          الزكاة فريضة عظيمة تعزز التكافل الاجتماعي وتساعد في سد حاجات الفقراء.
          قم بالوفاء بهذا الركن بسهولة عبر استخدام حاسبة الزكاة أو دفعها مباشرة
          لتصل إلى مستحقيها.
        </p>
        <BiSolidQuoteAltLeft
          size={50}
          color="green"
          aria-label="Quote Icon"
          className="opacity-75 self-end"
        />
      </section>
    </main>
  );
}
