import React from "react";
import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      className="bg-mangoBlack p-4 md:p-6 rounded-lg shadow-md mb-4 md:mb-6"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-200 text-center md:text-right">
        تعلم كيفية استخدام مزايا الباقة
      </h1>
    </motion.header>
  );
}
