"use client";
import React from "react";
import FeatureCard from "../FeatureCard";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";

export default function DonationMethods() {
  return (
    <div
      dir="rtl"
      className="container lg:h-[70vh] grid place-content-center justify-items-center mx-auto p-6"
    >
      <Typography
        variant="h3"
        className="mb-4 font-bold text-blue-800 text-center"
      >
        طرق التبرع ورسوم المنصة
      </Typography>
      <Typography
        variant="paragraph"
        className="mb-6 text-gray-700 text-center max-w-xl"
      >
        من أجل تسهيل عملية التبرع وتشجيع جميع فئات المجتمع على المشاركة في العمل
        الخيري، تعتمد منصتنا على ثلاث طرق للتبرع تختلف في آلية احتساب الرسوم
        وتوفير خيارات تناسب مختلف الاحتياجات:
      </Typography>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="bg-gray-100 dark:bg-gray-800 border border-borderColor  shadow-lg rounded-lg  p-5 hover:shadow-2xl transition-all"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FeatureCard
            title="التبرع المباشر برسوم ثابتة"
            description="عند اختيار هذه الطريقة، يُطلب من المتبرع دفع مبلغ التبرع الذي يرغب فيه بالإضافة إلى رسم ثابت قدره 50 دينار جزائري لكل عملية تبرع، بغض النظر عن قيمة التبرع."
            features={[
              "رسم ثابت: 50 دج",
              "الحد الأدنى للتبرع: 500 دج",
              "طرق الدفع: SATIM (مع رسوم ضريبة 50 دج)",
            ]}
          />
        </motion.div>

        <motion.div
          className="bg-gray-100 dark:bg-gray-800 border border-borderColor  shadow-lg rounded-lg  p-5 hover:shadow-2xl transition-all"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FeatureCard
            title="شحن الحساب بالنقاط"
            description="يمكن للمستخدم شحن حسابه بالنقاط من خلال خدمة الشحن الموجودة في قسم حسابي، بحيث يُعادّل كل 1 نقطة إلى 1 دينار جزائري، مما يتيح له التحكم في ميزانيته والتبرع بمبالغ تناسب إمكانياته."
            features={[
              "رسوم: 15 دج (للتبرعات بين 100 - 500 دج)",
              "رسوم: 50 دج (للتبرعات أكثر من 500 دج)",
              "الحد الأدنى للتبرع: 100 دج",
            ]}
          />
        </motion.div>

        <motion.div
          className="bg-gray-100 dark:bg-gray-800 border border-borderColor  shadow-lg rounded-lg  p-5 hover:shadow-2xl transition-all"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <FeatureCard
            title="تحويل نقاط سفراء عطاء"
            description="تُعد هذه الطريقة مجانية بالكامل للمستخدم، حيث يمكن كسب نقاط من خلال نشر فرص التبرع عبر وسائل التواصل الاجتماعي، ثم تحويلها إلى رصيد للتبرع."
            features={[
              "مجاني تمامًا",
              "الحد الأدنى للتحويل: 100 دج",
              "كسب النقاط عبر المشاركة الاجتماعية",
            ]}
          />
        </motion.div>
      </div>
    </div>
  );
}
