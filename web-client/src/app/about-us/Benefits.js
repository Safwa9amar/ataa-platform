import DividerWithText from "@/components/UI/DividerWithText";
import React from "react";
import { motion } from "framer-motion";

const benefits = [
  { title: "السهولة", description: "تبرع في أي وقت وأي مكان." },
  {
    title: "التنوع",
    description: "مجالات متنوعة تغطي العديد من جوانب العمل الخيري.",
  },
  {
    title: "السرعة",
    description: "خيارات متعددة للتبرع مع خاصية التبرع السريع دون تصفح للفرص.",
  },
  {
    title: "الأمان",
    description: "نطبق أعلى المعايير التقنية في أمن المعلومات.",
  },
  {
    title: "الشفافية",
    description:
      "نتبع أعلى معايير الشفافية في مختلف ممارساتنا الإدارية والمالية.",
  },
  {
    title: "التقارير",
    description:
      "العناية بالمتبرعين من خلال تزويدهم بتقارير تعكس أثر تبرعاتهم.",
  },
];
export default function Benefits() {
  return (
    <section>
      {/* Benefits Section Title */}
      <DividerWithText>
        <motion.h2
          className="text-3xl font-semibold mb-6 text-teal-600"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          المزايا
        </motion.h2>
      </DividerWithText>

      {/* Benefits Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center bg-teal-100 justify-center p-8 bg-mangoBlack rounded-lg rounded-tr-full rounded-bl-full shadow-lg transition-all hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <h3 className="text-lg font-bold text-teal-800 mb-2">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
