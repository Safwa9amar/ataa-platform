"use client";
import React, { Suspense, useRef } from "react";
import { motion, useInView } from "framer-motion";
import DonorInteractions from "./DonorInteractions";
import DistributionDonationsProgramPeriod from "./DistributionDonationsProgramPeriod";
import MonthlyProgramPerformance from "./MonthlyProgramPerformance";
import DistributionOfDonations from "./DistributionOfDonations";
import SectionHeader from "@/components/dashboards/SectionHeader";
import IndividualProgrammPerformance from "./IndividualProgrammPerformance";
import KpisCards from "./KpisCards";

// 🔄 أنيميشن عند الظهور
const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
};

// 🔹 مكون تحميل Skeleton أثناء انتظار البيانات
const SkeletonLoader = ({ text }) => (
  <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
    <p className="text-gray-500 dark:text-gray-400">{text}</p>
  </div>
);

// 🔹 المكون الرئيسي للوحة تحكم أداء البرامج
const ProgramsPerformanceDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      {/* عنوان الصفحة */}
      <FadeInSection>
        <SectionHeader
          title="لوحة تحكم أداء البرامج"
          description={"متابعة وتحليل أداء برامج التبرعات المختلفة."}
        />
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <KpisCards />
      </FadeInSection>

      {/* 🔹 تفاعلات المتبرعين */}
      <FadeInSection delay={0.2}>
        <div className="mb-8">
          <Suspense
            fallback={
              <SkeletonLoader text="جاري تحميل تفاعلات المتبرعين..." />
            }
          >
            <DonorInteractions />
          </Suspense>
        </div>
      </FadeInSection>

      {/* 🔹 توزيع التبرعات حسب الفترة */}
      <FadeInSection delay={0.3}>
        <div className="mb-8">
          <Suspense
            fallback={
              <SkeletonLoader text="جاري تحميل توزيع التبرعات حسب الفترة..." />
            }
          >
            <DistributionDonationsProgramPeriod />
          </Suspense>
        </div>
      </FadeInSection>

      {/* 🔹 توزيع مكونات الأداء المالي */}
      <FadeInSection delay={0.4}>
        <Suspense fallback={<SkeletonLoader text="جاري تحميل توزيع التبرعات..." />}>
          <DistributionOfDonations />
        </Suspense>
      </FadeInSection>

      <FadeInSection delay={0.5}>
        <IndividualProgrammPerformance />
      </FadeInSection>
    </div>
  );
};

export default ProgramsPerformanceDashboard;
