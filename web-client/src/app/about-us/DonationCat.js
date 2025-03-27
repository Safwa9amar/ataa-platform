import DividerWithText from "@/components/UI/DividerWithText";
import { motion } from "framer-motion";
import React from "react";
import { FaAppleAlt, FaHeartbeat, FaQuestionCircle } from "react-icons/fa";
import { FaHouseMedical, FaSchool, FaUsers } from "react-icons/fa6";

const donationCategories = [
  { title: "تعليمي", icon: <FaSchool size={32} />, color: "bg-blue-500" },
  { title: "صحي", icon: <FaHeartbeat size={32} />, color: "bg-green-500" },
  { title: "سكني", icon: <FaHouseMedical size={32} />, color: "bg-yellow-500" },
  { title: "اجتماعي", icon: <FaUsers size={32} />, color: "bg-red-500" },
  { title: "غذائي", icon: <FaAppleAlt size={32} />, color: "bg-orange-500" },
  {
    title: "غيرها",
    icon: <FaQuestionCircle size={32} />,
    color: "bg-gray-500",
  },
];
export default function DonationCat() {
  return (
    <section className="mt-10">
      {/* Donation Categories Title */}
      <DividerWithText>
        <motion.h2
          className="text-3xl font-semibold mb-6 text-teal-600"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          مجالات التبرع
        </motion.h2>
      </DividerWithText>

      {/* Donation Categories Cards */}
      <div className="flex gap-2 justify-around">
        {donationCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="flex flex-col items-center justify-center gap-2"
          >
            <div
              className={`flex flex-col items-center p-6 ${category.color} text-white w-20 h-20 rounded-full shadow-lg transition-all hover:scale-105 hover:shadow-xl`}
            >
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold">{category.title}</h3>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
