"use client";
import React, { useEffect, useState } from "react";
import SectionHeader from "@/components/dashboards/SectionHeader";
import { FinancialKpiCard } from "@/components/dashboards/FinancialKpiCard";
import MonthlyRevenueGrowth from "./MonthlyRevenueGrowth";
import RevenueVsExpenses from "./RevenueVsExpenses";
import ExpenseDistributionByActivity from "./ExpenseDistributionByActivity";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import { useCredentials } from "@/context/CredentialsContext";
import { DataFetchError } from "@/components/layouts/DataFetchError";

const FinancialDashboard = () => {
  const { userToken } = useCredentials();
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        API_ENDPOINTS.DASHBOARDS.financial + "/kpis-data",
        {
          headers: getCommonHeaders(userToken),
        }
      );
      setKpiData(res.data);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل البيانات المالية");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userToken]); // Ensure fetch is retried if userToken changes

  return (
    <div className="p-6 text-right">
      <SectionHeader
        title="لوحة التحكم المالية الشاملة"
        description="لوحة تفاعلية لرصد ومتابعة الأداء المالي للجمعية بشكل لحظي، مع إمكانية تحليل المؤشرات الرئيسية واتخاذ القرارات المستنيرة."
      />

      <div
        dir="rtl"
        className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8"
      >
        {error ? (
          <DataFetchError error={error} onRetry={fetchData} />
        ) : (
          kpiData && (
            <>
              <FinancialKpiCard
                loading={loading}
                title="صافي الدخل"
                value={`${kpiData?.netIncome?.toLocaleString()} دينار`}
                description="صافي الربح بعد خصم جميع النفقات من الإيرادات"
                color="text-blue-600"
              />
              <FinancialKpiCard
                loading={loading}
                title="هامش الربح الإجمالي"
                value={`${kpiData?.grossProfitMargin}%`}
                description="النسبة المئوية للإيرادات المتبقية بعد خصم تكاليف البرامج"
                color="text-green-600"
              />
              <FinancialKpiCard
                loading={loading}
                title="نسبة التبرعات إلى النفقات"
                value={`${kpiData?.donationExpenseRatio}%`}
                description="النسبة بين إجمالي التبرعات والنفقات التشغيلية"
                color="text-purple-600"
              />
              <FinancialKpiCard
                loading={loading}
                title="اجمالي الايرادات"
                value={kpiData?.totalRevenue}
                description="مجموع الايردات"
                color="text-teal-600"
              />
              {/* totalLiabilities */}
              <FinancialKpiCard
                loading={loading}
                title="اجمالي النفقات"
                value={kpiData?.totalLiabilities}
                description="مجموع النفقات"
                color="text-red-600"
              />
            </>
          )
        )}
      </div>

      {/* Additional components */}
      <MonthlyRevenueGrowth />
      <RevenueVsExpenses />
      <ExpenseDistributionByActivity />
    </div>
  );
};

export default FinancialDashboard;
