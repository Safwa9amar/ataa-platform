"use client";
import HoverCard from "@/components/UI/HoverCard";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import React from "react";

export default function Page() {
  return (
    <div className="container mx-auto p-10 space-y-8" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          className="text-textColor font-bold text-center"
        >
          "شفافية والتزام شرعي في إدارة التبرعات"
        </Typography>
        <Typography
          variant="lead"
          className="text-secondaryTextColor text-center max-w-2xl mx-auto leading-relaxed"
        >
          نسعى في عطاء إلى ضمان أن كل عملية تبرع تُدار وفقاً للضوابط الشرعية
          المعتمدة، مع الالتزام التام بمبدأ الأمانة والشفافية.
        </Typography>
      </motion.div>

      <div className="h-[50vh] grid xl:grid-cols-3 place-items-center gap-10">
        {[
          {
            title: "طرق التبرع ورسوم المنصة",
            desc: "تعرف على مختلف طرق التبرع والرسوم المفروضة.",
            href: "/platform-fees/donation-methods",
          },
          {
            title: "الحد الأدنى للتبرعات",
            desc: "تفاصيل الحد الأدنى للمبالغ المسموح بالتبرع بها.",
            href: "/platform-fees/minimum-donation",
          },
          {
            title: "رأي الإسلام",
            desc: "تعرف على الفتاوى الشرعية المتعلقة بالتبرعات.",
            href: "/platform-fees/islam-opinion",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="bg-mangoBlack border border-borderColor shadow-sm hover:shadow-lg w-fit min-h-[250px]  p-2 rounded-xl grid place-content-center"
          >
            <HoverCard
              variant="h5"
              desciption={item.desc}
              title={item.title}
              href={item.href}
              className="shadow-lg rounded-xl hover:shadow-2xl transition-shadow duration-300"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
