"use client";
import React, { useState, useEffect } from "react";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
import { FinancialKpiCard } from "@/components/dashboards/FinancialKpiCard";

const DonorKpiCards = () => {
  const { userToken } = useCredentials();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_ENDPOINTS.DASHBOARDS.accountHealth}/kpi-metrics`,
          { headers: getCommonHeaders(userToken) }
        );
        console.log(res.data);

        setKpiData(res.data);
      } catch (error) {
        console.error("Error fetching KPI data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userToken]);

  return (
    <div
      dir="rtl"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4"
    >
      <FinancialKpiCard
        loading={loading}
        title="المتبرعون النشطون شهريًا"
        value={`${kpiData?.MAU}`}
        description="عدد المتبرعين الفريدين الذين تبرعوا لبرامج الجمعية خلال الشهر."
        color="text-blue-600"
        currency=""
      />
      <FinancialKpiCard
        loading={loading}
        title="معدل الاحتفاظ بالمتبرعين"
        value={kpiData?.retentionRate}
        description="إجمالي عدد المتبرعين الذين قاموا بتكرار التبرع خلال الفترة المحددة."
        color="text-purple-600"
      />
      <FinancialKpiCard
        loading={loading}
        title="درجة نشاط الحساب"
        value={kpiData?.accountActivityScore}
        description={
          "تقييم يعكس مدى نشاط الحساب بناءً على التفاعل، والتحديثات، والنمو"
        }
        currency=""
        color="text-green-600"
      />
    </div>
  );
};

export default DonorKpiCards;
