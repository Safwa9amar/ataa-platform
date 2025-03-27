"use client";
import { FinancialKpiCard } from "@/components/dashboards/FinancialKpiCard";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function KPIcards() {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // جلب البيانات من API
  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        API_ENDPOINTS.DASHBOARDS.SUPPLIERS + "financial-performance/kpis",
        {
          headers: getCommonHeaders(userToken),
        }
      );
      console.log(res.data);

      setData(res.data);
    } catch (error) {
      setError("حدث خطأ ما يرجى اعادة التحميل");
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    getData();
  }, []);

  // عرض رسالة الخطأ في حالة وجود خطأ
  if (error) return <DataFetchError error={error} onRetry={getData} />;

  return (
    <div className="grid  gap-5" dir="rtl">
      {data.map((kpi, index) => (
        <FinancialKpiCard
          key={index}
          description={kpi.description}
          title={kpi.title}
          value={kpi.value}
          loading={loading}
          currency={kpi.currency || ""}
          color={kpi.color || ""}
        />
      ))}
    </div>
  );
}
