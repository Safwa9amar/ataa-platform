"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

import TotalDonationsOverPeriods from "./TotalDonationsOverPeriods";
import DonorRetentionRate from "./DonorRetentionRate";
import DonationGrowthRate from "./DonationGrowthRate";
import SuccessfullyCompletedPrograms from "./SuccessfullyCompletedPrograms";
import PercentageOfCompletedPrograms from "./PercentageOfCompletedPrograms";
import NewDonorsOverTime from "./NumberOfNewDonors";
import RateOfCompletedProgramsChart from "./RateOfCompletedProgramsChart";

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

const ExecutiveSummaryDashboard = () => {
  return (
    <div className="p-6 text-right">
      <FadeInSection>
        <h1 className="text-2xl font-bold mb-6">لوحة الملخص التنفيذي</h1>
      </FadeInSection>

      <FadeInSection delay={0.1}>
        <TotalDonationsOverPeriods />
      </FadeInSection>

      <FadeInSection delay={0.2}>
        <DonationGrowthRate />
      </FadeInSection>

      <div className="grid lg:grid-cols-2 gap-2">
        <FadeInSection delay={0.3}>
          <SuccessfullyCompletedPrograms />
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <NewDonorsOverTime />
        </FadeInSection>
      </div>

      <FadeInSection delay={0.5}>
        <RateOfCompletedProgramsChart />
      </FadeInSection>

      <FadeInSection delay={0.6}>
        <DonorRetentionRate />
      </FadeInSection>
    </div>
  );
};

export default ExecutiveSummaryDashboard;
