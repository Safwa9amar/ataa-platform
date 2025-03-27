"use client";
import React from "react";

// Enhanced Custom Tooltip
export const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        dir="rtl"
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700"
      >
        <p className="font-bold text-lg dark:text-gray-200">{label}</p>
        <div className="space-y-2 mt-2">
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium dark:text-gray-300">
                {entry.name}:
              </span>
              <span className="dark:text-gray-400">
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
