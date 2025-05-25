import React from "react";
import { CampaignOverview } from "./CampaignOverview";
import { MonthlyTrendsChart } from "./MonthlyTrendsChart";
import { WeeklyGrowthChart } from "./WeeklyGrowthChart";
import { DonationMetrics } from "./DonationMetrics";
import { RegionalDistribution } from "./RegionalDistribution";
import { LocationPerformance } from "./LocationPerformance";

export default function page() {
  return (
    <main className="space-y-6 flex-1 overflow-auto p-4 md:p-6 bg-backgroundColor">
      <div dir="rtl" className="m-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CampaignOverview />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <WeeklyGrowthChart />
        <MonthlyTrendsChart />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DonationMetrics />
        <RegionalDistribution />
      </div>

      <div className="grid gap-6">
        <LocationPerformance />
      </div>
    </main>
  );
}
