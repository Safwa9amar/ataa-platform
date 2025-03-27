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
import { IconButton } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";

// ألوان المخطط
const COLORS = ["#059669", "#DC2626"]; // أخضر = نشطة، أحمر = غير نشطة

const CHART_CONFIG = {
  dataKey: "value",
  nameKey: "status",
  innerRadius: 50,
  outerRadius: 100,
};

export default function ActiveProgramsDistribution() {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.accountHealth}/active-programs-distribution`,
        { headers: getCommonHeaders(userToken) }
      );

      setState({
        data: res.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: "فشل تحميل بيانات توزيع البرامج",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken]);

  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FinancialChart
      action={
        <IconButton
          variant="text"
          onClick={handleRetry}
          className="dark:text-white"
        >
          <IoReload className="w-5 h-5" />
        </IconButton>
      }
      title="توزيع البرامج النشطة مقابل غير النشطة"
      description="يوضح هذا المخطط النسبة بين البرامج النشطة وغير النشطة، مما يساعد في فهم أداء المبادرات المختلفة."
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
                  fill={COLORS[index]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${value}%`}
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
              wrapperStyle={{
                paddingLeft: "20px",
                fontSize: "14px",
              }}
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
