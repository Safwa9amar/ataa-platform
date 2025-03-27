import React, { Suspense } from "react";
import DonorInteractions from "./DonorInteractions";
import DistributionDonationsProgramPeriod from "./DistributionDonationsProgramPeriod";
import MonthlyProgramPerformance from "./MonthlyProgramPerformance";
import DistributionOfDonations from "./DistributionOfDonations";
import SectionHeader from "@/components/dashboards/SectionHeader";
import IndividualProgrammPerformance from "./IndividualProgrammPerformance";
import KpisCards from "./KpisCards";

// **🔹 المكون الرئيسي للوحة تحكم أداء البرامج**
const ProgramsPerformanceDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      {/* عنوان الصفحة */}
      <SectionHeader
        title="لوحة تحكم أداء البرامج"
        description={"متابعة وتحليل أداء برامج التبرعات المختلفة."}
      />
      <KpisCards />
      {/* 🔹 تفاعلات المتبرعين */}
      <div className="mb-8">
        <Suspense
          fallback={<SkeletonLoader text="جاري تحميل تفاعلات المتبرعين..." />}
        >
          <DonorInteractions />
        </Suspense>
      </div>

      {/* 🔹 توزيع التبرعات حسب الفترة */}
      <div className="mb-8">
        <Suspense
          fallback={
            <SkeletonLoader text="جاري تحميل توزيع التبرعات حسب الفترة..." />
          }
        >
          <DistributionDonationsProgramPeriod />
        </Suspense>
      </div>

      {/* 🔹 توزيع مكونات الأداء المالي */}

      <Suspense
        fallback={<SkeletonLoader text="جاري تحميل توزيع التبرعات..." />}
      >
        <DistributionOfDonations />
      </Suspense>

      <IndividualProgrammPerformance />
    </div>
  );
};

// **🔹 مكون تحميل Skeleton أثناء انتظار البيانات**
const SkeletonLoader = ({ text }) => (
  <div className="w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse">
    <p className="text-gray-500 dark:text-gray-400">{text}</p>
  </div>
);

export default ProgramsPerformanceDashboard;
