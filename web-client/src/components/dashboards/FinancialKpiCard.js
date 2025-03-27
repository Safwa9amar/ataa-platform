"use client";
import React from "react";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

// Enhanced Tooltip Component
const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block ml-2">
    <svg
      className="w-4 h-4 text-gray-400 hover:text-primary cursor-pointer transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 w-48 text-center">
      {text}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 border-b border-r border-gray-100 dark:border-gray-700 rotate-45" />
    </div>
  </div>
);

// Enhanced Financial KPI Card
export const FinancialKpiCard = ({
  title,
  value,
  description,
  color = "text-primary",
  currency = "دينار",
  trend, // 'up' or 'down'
  loading = false,
}) => (
  <motion.div
    className="w-full bg-mangoBlack p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-borderColor"
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {loading ? (
      <div className="space-y-3">
        <Skeleton width={120} height={24} />
        <Skeleton width={80} height={32} />
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-600 dark:text-gray-300 text-sm flex items-center">
            {title}
            {description && <InfoTooltip text={description} />}
          </h3>
          {trend && (
            <span
              className={`text-sm ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? "▲" : "▼"}
            </span>
          )}
        </div>

        <div className="flex items-end justify-between">
          <p className={`${color} text-3xl font-bold tracking-tight`}>
            {value?.toLocaleString()}
          </p>
          <span className="text-gray-500 dark:text-gray-400 text-sm mb-1">
            {currency}
          </span>
        </div>
      </>
    )}
  </motion.div>
);

// Enhanced KPI Grid
export const FinancialKpiGrid = ({ kpis, loading }) => {
  return (
    <div className="grid grid-cols-3 justify-between gap-5 m-2" dir="rtl">
      {loading
        ? Array(3)
            .fill(0)
            .map((_, index) => <FinancialKpiCard key={index} loading />)
        : kpis.map((kpi, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <FinancialKpiCard {...kpi} />
            </motion.div>
          ))}
    </div>
  );
};
