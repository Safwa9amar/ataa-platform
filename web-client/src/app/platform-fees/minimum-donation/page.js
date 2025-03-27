"use client";
import React from "react";
import FeatureCard from "../FeatureCard";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

export default function MinimumDonation() {
  return (
    <div
      dir="rtl"
      className="container lg:h-[70vh] grid place-content-center justify-items-center mx-auto p-6"
    >
      <Typography
        variant="h3"
        className="mb-4 font-bold text-blue-800 text-center"
      >
        الحد الأدنى للتبرعات
      </Typography>
      <Typography
        variant="paragraph"
        className="mb-6 text-gray-700 text-center max-w-xl"
      >
        حرصًا على تسهيل عملية التبرع وتلبية احتياجات جميع المستخدمين، تعتمد
        منصتنا على حدود دنيا مختلفة للتبرع وفقًا للطريقة المختارة. تسعى المنصة
        من خلال هذه الحدود الدنيا إلى ضمان إمكانية المشاركة لجميع فئات المجتمع
        مع الحفاظ على استدامة الخدمات المقدمة وتوسيع نطاق الدعم المقدم للجمعيات
        الخيرية.
      </Typography>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <motion.div
          className="bg-gray-100 dark:bg-gray-800 border border-borderColor  shadow-lg rounded-lg  p-5 hover:shadow-2xl transition-all"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FeatureCard
            title="التبرع المباشر برسوم ثابتة"
            description="تُقبل التبرعات بمبلغ 500 دينار جزائري فما فوق لضمان تقديم دعم فعّال للمستفيدين."
            features={["الحد الأدنى: 500 دج"]}
          />
        </motion.div>

        <motion.div
          className="bg-gray-100 dark:bg-gray-800 border border-borderColor  shadow-lg rounded-lg  p-5 hover:shadow-2xl transition-all"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FeatureCard
            title="شحن الحساب بالنقاط ونقاط سفراء عطاء"
            description="تُقبل التبرعات بمبلغ 100 دينار جزائري فما فوق، مما يسمح بمشاركة أوسع من المجتمع في دعم القضايا الخيرية."
            features={["الحد الأدنى: 100 دج"]}
          />
        </motion.div>
      </div>
    </div>
  );
}
