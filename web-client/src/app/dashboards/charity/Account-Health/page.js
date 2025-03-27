import React from "react";
import DonorKpiCards from "./DonorKpiCards";
import ActiveProgramsDistribution from "./ActiveProgramsDistribution";
import OngoingVsIncompletePrograms from "./OngoingVsIncompletePrograms";
import ProgramsEngagementComparison from "./ProgramsEngagementComparison";
import DonorGrowthOverTime from "./DonorGrowthOverTime";
import SectionHeader from "@/components/dashboards/SectionHeader";

export default function AccountHealthDashboard() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* عنوان الصفحة */}
      <SectionHeader
        title="لوحة صحة الحساب"
        description="نظرة شاملة حول صحة الحساب وأداء البرامج."
      />

      {/* 👤 مؤشرات الأداء الرئيسية (KPI Cards) */}
      <div className="mb-8">
        <DonorKpiCards />
      </div>

      {/* 📊 المخططات الدائرية (Pie Charts) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActiveProgramsDistribution />
        <OngoingVsIncompletePrograms />
      </div>

      {/* 📈 المخططات العمودية (Bar Charts) */}
      <div className="mb-8">
        <ProgramsEngagementComparison />
      </div>

      {/* 📉 المخططات الخطية (Line Charts) */}
      <div className="mb-8">
        <DonorGrowthOverTime />
      </div>
    </div>
  );
}
