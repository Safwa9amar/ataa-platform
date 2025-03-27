import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiChat1, CiMail } from "react-icons/ci";
import { IoCall } from "react-icons/io5";

export default function layout({ children }) {
  return (
    <section dir="rtl">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-teal-600 dark:text-teal-300">
          تواصل معنا
        </h2>
        <p className="mb-8 lg:mb-10 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
          هل لديك مشكلة تقنية؟ أو ترغب في إرسال ملاحظات حول ميزة تجريبية؟ أو
          بحاجة إلى تفاصيل حول خططنا التجارية؟ دعنا نعرف.
        </p>
        <Image
          className="mx-auto"
          src="/images/contactUs.png"
          width={500}
          height={500}
        />
        <div className="flex justify-evenly gap-4 bg-mangoBlack rounded-xl p-5 my-5">
          <Link
            className="text-teal-600 dark:text-teal-300 hover:text-teal-700 scale-95 hover:scale-110 shadow-md transition-transform dark:hover:text-teal-400 bg-teal-100 dark:bg-teal-800 p-2 rounded-full"
            href="/contact-us"
          >
            <CiMail size={32} />
          </Link>
          <Link
            className="text-teal-600 dark:text-teal-300 hover:text-teal-700 scale-95 hover:scale-110 shadow-md transition-transform dark:hover:text-teal-400 bg-teal-100 dark:bg-teal-800 p-2 rounded-full"
            href="/contact-us/call"
          >
            <IoCall size={32} />
          </Link>
          <Link
            className="text-teal-600 dark:text-teal-300 hover:text-teal-700 scale-95 hover:scale-110 shadow-md transition-transform dark:hover:text-teal-400 bg-teal-100 dark:bg-teal-800 p-2 rounded-full"
            href="/contact-us/chat"
          >
            <CiChat1 size={32} />
          </Link>
        </div>
        {children}
      </div>
    </section>
  );
}
