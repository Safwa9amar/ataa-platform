"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PaymentCard from "@/components/UI/PaymentCard";
import { useCredentials } from "@/context/CredentialsContext";
import { getAllPlans } from "@/services/planServices";
import UILoading from "@/components/UI/Loading";
import Swal from "sweetalert2";
function RednderCards() {
  const { userToken, user, loading: authload } = useCredentials();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      if (authload) return;
      try {
        const data = await getAllPlans(userToken);
        setPlans(data[user.role]);
      } catch (error) {
        console.error("Failed to fetch plans", error);
        Swal.fire({
          icon: "error",
          title: "حدث خطأ ما ",
          text: "يرجى المحاولة مرة أخرى",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <UILoading />; // Show loading spinner while fetching data
  }

  return plans?.map((plan, index) => (
    <motion.div
      key={index}
      className={`max-w-96 p-8 rounded-lg shadow-md  bg-opacity-50 border  border-gray-300 transition-shadow duration-300 flex flex-col justify-between ${
        index === 1
          ? "row-span-2 z-10 bg-teal-300 border border-teal-400"
          : "bg-white dark:bg-gray-800 dark:border-gray-700"
      } transition-transform duration-300`}
      initial={{ opacity: 0, scale: 0.95 }} // Initial animation state
      animate={{ opacity: 1, scale: 1 }} // Animation on mount
      exit={{ opacity: 0, scale: 0.95 }} // Animation on exit
      transition={{ duration: 0.1 }} // Transition duration
      whileHover={{
        scale: 1.05, // Scale up slightly on hover
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)", // Add shadow on hover
      }}
    >
      <PaymentCard isActive={index === 1} key={plan.id} plan={plan} />
    </motion.div>
  ));
}

export default RednderCards;
