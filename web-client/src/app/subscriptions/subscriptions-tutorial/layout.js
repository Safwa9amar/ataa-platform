"use client";
import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import AsideNav from "./AsideNav";

export default function layout({ children }) {
  return (
    <motion.div
      dir="rtl"
      className="bg-gray-100 dark:bg-gray-900 p-4 md:p-6 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <Header />

      <div className="flex flex-col lg:flex-row flex-1 gap-6">
        {/* Navigation Aside */}
        <AsideNav />
        {/* Main Content */}
        {children}
      </div>
    </motion.div>
  );
}
