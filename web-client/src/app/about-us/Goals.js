import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import HoverCard from "@/components/UI/HoverCard";
import DividerWithText from "@/components/UI/DividerWithText";
const goals = [
  {
    title: "إنشاء",
    description: " منصة رقمية تفاعلية، آمنة وسهلة الاستخدام.",
  },
  {
    title: "تمكين",
    description: " المتبرعين من المشاركة في مختلف الأنشطة الخيرية عبر المنصة.",
  },
  {
    title: "ضمان",
    description: " الشفافية ورفع تقارير عن أنشطة المنصة والقطاع.",
  },
  {
    title: "اعتماد",
    description: " المنصة من قبل المتبرعين وجهات جمع التبرعات من خلال التسويق.",
  },
  {
    title: "تمثيل",
    description: " احتياجات الأشخاص وإيصال أصواتهم لمن يمكنهم المساعدة.",
  },
  {
    title: "توظيف",
    description: " الذكاء الاصطناعي والرقمنة والشباب الكفء.",
  },
  {
    title: "تنسيق",
    description: " الخدمات بين أصحاب المصلحة في القطاع الخيري.",
  },
  {
    title: "إعداد",
    description: " قاعدة بيانات خاصة بالقطاع الخيري والتنموي.",
  },
  {
    title: "إبرام",
    description: " شراكات محلية ودولية لتحسين أداء القطاع.",
  },
  {
    title: "خلق",
    description:
      "منظومة متكاملة تضمن تعزيز التعاون بين القطاعات الحكومية والخاصة وغير الربحية.",
  },
  {
    title: "تعزيز",
    description:
      " أداء ومكانة الجزائر في المؤشرات العالمية الخاصة بالعمل الخيري.",
  },
  {
    title: "تعزيز",
    description:
      " الحملات التسويقية المستهدفة لمشاركين جدد في الأنشطة الخيرية.",
  },
];
const GoalsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true }); // Trigger animation only once

  return (
    <section ref={sectionRef}>
      {/* Objectives Section */}
      <DividerWithText>
        <motion.h2
          className="text-3xl drop-shadow-lg font-semibold mb-3 text-teal-600"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -30 }}
          transition={{ duration: 2 }}
        >
          الأهداف
        </motion.h2>
      </DividerWithText>
      <div className="flex flex-wrap w-full justify-center ">
        {goals.map((g, index) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
            transition={{ duration: 0.6, delay: index * 0.2 }} // Delay each card's animation
            className="m-4"
          >
            <HoverCard title={g.title} desciption={g.description} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GoalsSection;
