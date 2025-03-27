"use client";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { IconButton, Select, Option } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";

// ألوان المخطط
const COLORS = ["#4f46e5", "#059669", "#d97706", "#9333ea", "#dc2626"];

// إعدادات المخطط
const CHART_CONFIG = {
  dataKey: "value",
  nameKey: "category",
  innerRadius: 60,
  outerRadius: 100,
};

// الخيارات المتاحة للتوزيع
const DISTRIBUTION_OPTIONS = {
  age: "توزيع التبرعات حسب الفئات العمرية",
  location: "توزيع التبرعات حسب المناطق الجغرافية",
};

export default function DonationDistribution() {
  const { userToken } = useCredentials();
  const [distributionType, setDistributionType] = useState("age"); // التحكم بنوع التوزيع
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const endpoint =
        distributionType === "age"
          ? API_ENDPOINTS.DASHBOARDS.donor + "/donation-distribution-age"
          : API_ENDPOINTS.DASHBOARDS.donor + "/donation-distribution-location";

      const res = await axios.get(endpoint, {
        headers: getCommonHeaders(userToken),
      });

      setState({
        data: res.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: "فشل تحميل بيانات توزيع التبرعات",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken, distributionType]);

  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FinancialChart
      action={
        <div className="flex items-center gap-3">
          <Select
            value={distributionType}
            onChange={(value) => setDistributionType(value)}
            className="dark:text-white"
          >
            <Option value="age">{DISTRIBUTION_OPTIONS.age}</Option>
            <Option value="location">{DISTRIBUTION_OPTIONS.location}</Option>
          </Select>
          <IconButton
            variant="text"
            onClick={handleRetry}
            className="dark:text-white"
          >
            <IoReload className="w-5 h-5" />
          </IconButton>
        </div>
      }
      title="توزيع التبرعات"
      description={`يظهر هذا المخطط توزيع التبرعات حسب ${
        distributionType === "age" ? "الفئات العمرية" : "المناطق الجغرافية"
      }، مما يساعد على تحليل أنماط التبرع.`}
      loading={state.loading}
    >
      {state.error ? (
        <DataFetchError error={state.error} onRetry={handleRetry} />
      ) : state.data.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={state.data}
              dataKey={CHART_CONFIG.dataKey}
              nameKey={CHART_CONFIG.nameKey}
              cx="50%"
              cy="50%"
              innerRadius={CHART_CONFIG.innerRadius}
              outerRadius={CHART_CONFIG.outerRadius}
              fill="#4f46e5"
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {state.data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => new Intl.NumberFormat("ar").format(value)}
              contentStyle={{
                textAlign: "right",
                backgroundColor: "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              iconSize={12}
              iconType="circle"
              wrapperStyle={{ paddingLeft: "20px", fontSize: "14px" }}
              formatter={(value) => (
                <span className="text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
