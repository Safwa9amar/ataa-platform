"use client";
import { FinancialKpiCard } from "@/components/dashboards/FinancialKpiCard";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function KpisCards() {
  const { userToken } = useCredentials();
  const [kpis, setKpis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch KPIs data
  const getKpis = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.programsPerformance}/kpis/`,
        { headers: getCommonHeaders(userToken) }
      );
      setKpis(response.data);
    } catch (error) {
      setError("حدث خطأ ما في جلب البيانات يرجى اعادة المحاولة");
    } finally {
      setLoading(false);
    }
  };

  // Fetch KPIs on component mount
  useEffect(() => {
    getKpis();
  }, []);

  // Display error message if data fetching fails
  if (error) {
    return <DataFetchError error={error} onRetry={getKpis} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-9" dir="rtl">
      {/* Average Donation KPI Card */}
      <FinancialKpiCard
        title={"متوسط التبرعات"}
        value={kpis.avgDonation?.toFixed(2)}
        description={
          "متوسط قيمة التبرعات لكل البرامج. يتم حسابه بقسمة إجمالي التبرعات على عدد التبرعات."
        }
        currency="دينار جزائري"
        loading={loading}
        color="#059669"
      />

      {/* Program Completion Rate KPI Card */}
      <FinancialKpiCard
        title={"معدل اكمال البرامج"}
        value={kpis.programCompletionRate?.toFixed(2) + "%"}
        description={
          "نسبة البرامج التي تم تنفيذها أو استكمالها بنجاح. يتم حسابه بقسمة عدد البرامج المكتملة على إجمالي عدد البرامج."
        }
        currency=""
        color="#4f46e5"
        loading={loading}
      />
    </div>
  );
}
