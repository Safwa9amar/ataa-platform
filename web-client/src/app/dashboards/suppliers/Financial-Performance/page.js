"use client";
import { Typography } from "@material-tailwind/react";
import React from "react";
import RevenueByCategoryChart from "./RevenueByCategoryChart";
import RevenueByProductChart from "./RevenueByProductChart";
import TotalRevenueOverTimeChart from "./TotalRevenueOverTimeChart";
import KPIcards from "./KPIcards";

export default function page() {
  return (
    <div className="container mx-auto p-10 space-y-10">
      <div className="space-y-5">
        <Typography variant="lead" className="font-bold text-textColor">
          لوحة الاداء المالي
        </Typography>
        <Typography className="mb-4 w-80 font-normal text-gray-600 md:w-full">
          تحليل الأداء المالي للموردين من خلال تتبع الإيرادات
        </Typography>
      </div>
      <KPIcards />
      <RevenueByCategoryChart />
      <RevenueByProductChart />
      <TotalRevenueOverTimeChart />
    </div>
  );
}
