"use client";
import Link from "next/link";
import React from "react";
import { Button, Typography } from "@material-tailwind/react";
import Markdown from "react-markdown";
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/24/solid";
import BloodDonationRequirements from "./BloodDonationRequirements";

export default function BloodDonationLandingPage() {
  return (
    <main
      className=" flex flex-col items-center justify-center p-5 gap-5"
      dir="rtl"
    >
      {/* Campaigns Cards Section */}
      <section className="w-full max-w-screen-xl px-4 py-12 text-right">
        <h1 className="text-3xl md:text-4xl font-semibold mb-4">
          تبرع بالدم، أنقذ حياة
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-8">
          التبرع بالدم هو أمل للكثيرين. ساعد في إنقاذ الأرواح اليوم وانضم إلى
          حملات التبرع المختلفة.
        </p>
        <Link href="/our-programmes/blood-donation/create">
          <Button
            color="red"
            variant="gradient"
            className="mb-5 font-ElMessiri flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>انشء حملتك</span>
          </Button>
        </Link>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          اختر حملتك
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* User Campaign Card */}
          <Link href="./blood-donation/users-campaigns">
            <div className="bg-mangoBlack p-6 rounded-xl shadow-lg flex flex-col justify-between h-[550px] hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold text-red-600 mb-4">
                حملات المستخدمين
              </h3>{" "}
              <img
                src={"/images/d_6877c440faf128f0728c113e48bdc794.jpg"}
                className="w-full rounded-md"
              />
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                انضم إلى حملات تبرع بالدم أنشأها مستخدمون مثلك. حملتك قد تكون
                الأمل لشخص في حاجة.
              </p>
              <Button
                variant="outlined"
                color="red"
                className="w-full mt-4"
                aria-label="عرض الحملات"
              >
                استعرض الحملات
              </Button>
            </div>
          </Link>

          {/* National Campaign Card */}
          <Link href="./blood-donation/national-campaigns">
            <div className="bg-mangoBlack p-6 rounded-xl shadow-lg flex flex-col justify-between h-[550px] hover:shadow-2xl transition-shadow">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">
                حملات وطنية
              </h3>
              <img
                src={"/images/altbr_baldm.jpg"}
                className="w-full rounded-md"
              />
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                شارك في حملات التبرع بالدم الوطنية التي تهدف إلى توفير الدم
                للمحتاجين عبر البلاد.
              </p>
              <Button
                variant="outlined"
                color="blue"
                className="w-full mt-4"
                aria-label="عرض الحملات"
              >
                انضم للحملات الوطنية
              </Button>
            </div>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full max-w-screen-xl px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
          لماذا التبرع بالدم؟
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-mangoBlack p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              إنقاذ الأرواح
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              كل تبرع يمكن أن يساعد في إنقاذ حياة شخص في حاجة ماسة للدم.
            </p>
          </div>
          <div className="bg-mangoBlack p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              التأثير الإيجابي
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              التبرع بالدم يعود بالفائدة ليس فقط على الآخرين ولكن أيضًا على
              صحتك.
            </p>
          </div>
          <div className="bg-mangoBlack p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              شركاء في الإنسانية
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              كونك جزءًا من شبكة تبرعات الدم الوطنية يعزز المجتمع ويزيد من
              الوعي.
            </p>
          </div>
        </div>
      </section>
      <BloodDonationRequirements />

      {/* CTA Section */}
      <section className="w-full max-w-screen-xl px-4 py-16 bg-mangoBlack text-textColor text-center rounded-xl shadow-lg">
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">
          مستعد للتبرع بالدم؟
        </h2>
        <p className="text-lg md:text-xl mb-6">
          انضم إلى حملات التبرع بالدم اليوم وساهم في إنقاذ الأرواح.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="./blood-donation/users-campaigns">
            <Button
              variant="gradient"
              color="amber"
              className="rounded-full py-3 px-8 text-lg font-semibold hover:scale-105 transition-transform"
              aria-label="انضم للحملة"
            >
              انضم لحملة الآن
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
