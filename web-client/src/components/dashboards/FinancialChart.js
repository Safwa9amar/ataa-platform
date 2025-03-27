"use client";
import React from "react";
import { ResponsiveContainer } from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FinancialChart = ({
  title,
  description,
  children,
  loading = false,
  action,
}) => (
  <div className="bg-mangoBlack p-4 md:p-6 rounded-xl shadow-lg mb-8 w-full">
    {/* العنوان والأكشن */}
    <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-right">
      <div className="flex-shrink-0">{!loading && action}</div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex-1">
        {title}
      </h3>
    </div>

    {/* الوصف */}
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      {description}
    </p>

    {/* منطقة المخطط مع التحميل */}
    <div className="h-72 md:h-96 w-full relative ">
      {loading ? (
        <Skeleton
          height="100%"
          className="rounded-lg dark:bg-gray-700"
          containerClassName="absolute inset-0 w-full h-full"
          enableAnimation
        />
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  </div>
);

export default FinancialChart;
