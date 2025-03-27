"use client";
import React from "react";
import TotalDonationsOverPeriods from "./TotalDonationsOverPeriods";
import DonorRetentionRate from "./DonorRetentionRate";
import DonationGrowthRate from "./DonationGrowthRate";
import SuccessfullyCompletedPrograms from "./SuccessfullyCompletedPrograms";
import PercentageOfCompletedPrograms from "./PercentageOfCompletedPrograms";
import NewDonorsOverTime from "./NumberOfNewDonors";
import RateOfCompletedProgramsChart from "./RateOfCompletedProgramsChart";

const ExecutiveSummaryDashboard = () => {
  return (
    <div className="p-6 text-right">
      <h1 className="text-2xl font-bold mb-6">لوحة الملخص التنفيذي</h1>

      {/* Charts */}
      {/* إجمالي التبرعات عبر الفترات */}
      <TotalDonationsOverPeriods />
      <DonationGrowthRate />

      <div className="grid lg:grid-cols-2 gap-2">
        <SuccessfullyCompletedPrograms />
        <NewDonorsOverTime />
      </div>
      <RateOfCompletedProgramsChart />

      <DonorRetentionRate />
    </div>
  );
};

export default ExecutiveSummaryDashboard;
