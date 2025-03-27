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
      <SectionHeader title={"لوحة تحكم المتبرعين"} />
      <div className="grid md:grid-cols-4 gap-4 mb-4" dir="rtl">
        <FinancialKpiCard
          title={"العدد الكلي للمتبرعين"}
          value={kpis.totalDonors}
          description=""
          currency="متبرع"
          loading={loading}
          color="#059669"
        />
        {/* <FinancialKpiCard
          title={"المتبرعين الجدد"}
          value={kpis.newDonors}
          description=""
          currency="متبرع"
          loading={loading}
          color="#059669"
        /> */}
        <FinancialKpiCard
          title={"المتبرعين العادئين"}
          value={kpis.returningDonors}
          description=""
          currency="متبرع"
          loading={loading}
          color="#059669"
        />
        <FinancialKpiCard
          title={"متوسط حجم التبرعات"}
          value={kpis.averageDonation}
          description=""
          currency="دج"
          loading={loading}
          color="#059669"
        />
        <FinancialKpiCard
          title={"معدل التبرعات المتكررة"}
          value={kpis.recurringDonationRate}
          description=""
          currency=""
          loading={loading}
          color="#059669"
        />
      </div>

      {/* مخطط العمود للمتبرعين الجدد vs العائدين */}
      <NewVsReturningDonors />
      {/* مخطط الدونات للتوزيع العمري */}

      <DonationDistribution />

      {/* الصف الثاني: مخططات الخطوط */}
      <DonorGrowthRate />
      <AverageDonationSize />
    </div>
  );
};

export default DonorDashboard;
