"use client";
import React, { useState } from "react";
import DonationDistribution from "./DonationDistribution";
import NewVsReturningDonors from "./NewVsReturningDonors";
import DonorGrowthRate from "./DonorGrowthRate";
import AverageDonationSize from "./AverageDonationSize";
import SectionHeader from "@/components/dashboards/SectionHeader";
import { FinancialKpiCard } from "@/components/dashboards/FinancialKpiCard";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import { useCredentials } from "@/context/CredentialsContext";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const DonorDashboard = () => {
  const { userToken } = useCredentials();
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(false);

  const getKpis = async () => {
    setLoading(true);
    let data = await axios.get(API_ENDPOINTS.DASHBOARDS.donor + "/kpis", {
      headers: getCommonHeaders(userToken),
    });
    setKpis(data.data);
    setLoading(false);
  };

  React.useEffect(() => {
    getKpis();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-10 text-right">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
      >
        <SectionHeader title={"لوحة تحكم المتبرعين"} />
      </motion.div>

      <div className="grid md:grid-cols-4 gap-4 mb-4" dir="rtl">
        {[ 
          { title: "العدد الكلي للمتبرعين", value: kpis.totalDonors, currency: "متبرع" },
          { title: "المتبرعين العادئين", value: kpis.returningDonors, currency: "متبرع" },
          { title: "متوسط حجم التبرعات", value: kpis.averageDonation, currency: "دج" },
          { title: "معدل التبرعات المتكررة", value: kpis.recurringDonationRate, currency: "" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={i + 1}
          >
            <FinancialKpiCard
              title={item.title}
              value={item.value}
              description=""
              currency={item.currency}
              loading={loading}
              color="#059669"
            />
          </motion.div>
        ))}
      </div>

      {/* Animations for charts */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={5}>
        <NewVsReturningDonors />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={6}>
        <DonationDistribution />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={7}>
        <DonorGrowthRate />
      </motion.div>
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={8}>
        <AverageDonationSize />
      </motion.div>
    </div>
  );
};

export default DonorDashboard;
