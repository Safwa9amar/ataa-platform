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
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";
import { IconButton } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";

// إعدادات المخطط
const CHART_CONFIG = {
  strokeColor: "#4f46e5",
  xAxisKey: "month",
  dataKey: "growthRate",
  label: "الإيرادات الشهرية",
};

export default function MonthlyRevenueGrowth() {
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
        `${API_ENDPOINTS.DASHBOARDS.financial}/monthly-revenue-growth`,
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
        error: "فشل تحميل بيانات الإيرادات الشهرية",
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
      title="الإيرادات الشهرية ومعدل النمو المالي"
      description="يوضح هذا المخطط تغير الإيرادات الشهرية بمرور الوقت، مما يساعد على متابعة الأداء المالي للجمعية."
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
          <LineChart data={state.data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey={CHART_CONFIG.xAxisKey} tick={{ fill: "#4a5568" }} />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("ar").format(value)
              }
            />
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
              formatter={() => (
                <span className="text-gray-700 dark:text-gray-300">
                  {CHART_CONFIG.label}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey={CHART_CONFIG.dataKey}
              stroke={CHART_CONFIG.strokeColor}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
