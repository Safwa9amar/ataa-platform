"use client";
import React from "react";
import { motion, useInView } from "framer-motion";
import DonorKpiCards from "./DonorKpiCards";
import ActiveProgramsDistribution from "./ActiveProgramsDistribution";
import OngoingVsIncompletePrograms from "./OngoingVsIncompletePrograms";
import ProgramsEngagementComparison from "./ProgramsEngagementComparison";
import DonorGrowthOverTime from "./DonorGrowthOverTime";
import SectionHeader from "@/components/dashboards/SectionHeader";
import { useRef } from "react";

// مكون عام لإضافة الأنيميشن عند الظهور
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

export default function AccountHealthDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* عنوان الصفحة */}
      <FadeInSection>
        <SectionHeader
          title="لوحة صحة الحساب"
          description="نظرة شاملة حول صحة الحساب وأداء البرامج."
        />
      </FadeInSection>

      {/* 👤 مؤشرات الأداء الرئيسية (KPI Cards) */}
      <FadeInSection delay={0.1}>
        <div className="mb-8">
          <DonorKpiCards />
        </div>
      </FadeInSection>

      {/* 📊 المخططات الدائرية (Pie Charts) */}
      <FadeInSection delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ActiveProgramsDistribution />
          <OngoingVsIncompletePrograms />
        </div>
      </FadeInSection>

      {/* 📈 المخططات العمودية (Bar Charts) */}
      <FadeInSection delay={0.3}>
        <div className="mb-8">
          <ProgramsEngagementComparison />
        </div>
      </FadeInSection>

      {/* 📉 المخططات الخطية (Line Charts) */}
      <FadeInSection delay={0.4}>
        <div className="mb-8">
          <DonorGrowthOverTime />
        </div>
      </FadeInSection>
    </div>
  );
}
