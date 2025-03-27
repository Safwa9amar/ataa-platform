"use client";
import React, { useState } from "react";
import { Typography, Collapse, Button } from "@material-tailwind/react"; // Import Material Tailwind Collapse and Typography components
import PrivacyPolicy from "./RoleBasedPolicy";

export default function page() {
  const [openIndex, setOpenIndex] = useState(null); // Track which item is open

  // Toggle collapse state based on item index
  const toggleCollapse = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="p-6 lg:p-12 flex flex-col justify-center items-center"
      dir="rtl"
    >
      {/* Custom Header */}
      <div className="mb-6">
        <Typography
          variant="h4"
          color="blue-gray"
          className="font-bold text-center text-2xl sm:text-3xl md:text-4xl"
        >
          سياسة الخصوصية
        </Typography>
      </div>
      <PrivacyPolicy />
    </div>
  );
}
