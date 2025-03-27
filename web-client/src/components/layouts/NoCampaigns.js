"use client";
import React from "react";

export default function NoCampaigns({
  message = "لا توجد حملات متاحة حالياً",
  action,
}) {
  return (
    <div className=" flex flex-col items-center justify-center w-full h-full py-10">
      <img
        src="/images/nodata.png" // Replace with your own placeholder image or icon
        alt="No Data"
        className="w-48 h-48 mb-6"
      />
      <p className="text-gray-600 text-lg font-semibold mb-4">{message}</p>
      {action}
    </div>
  );
}
