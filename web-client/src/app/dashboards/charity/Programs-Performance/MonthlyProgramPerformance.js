"use client";

import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import { IconButton, Select, Option } from "@material-tailwind/react";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { IoReload } from "react-icons/io5";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 🟢 تحديد ألوان البرامج المختلفة في المخطط
const PROGRAM_COLORS = [
  "#4f46e5", // Indigo-600
  "#059669", // Emerald-600
  "#d97706", // Amber-600
  "#9333ea", // Purple-600
  "#dc2626", // Red-600
  "#2563eb", // Blue-600
  "#10b981", // Green-500
];

// 🟢 إعدادات المخطط
const CHART_CONFIG = {
  gridStroke: "#e5e7eb",
  axisColor: "#4a5568",
  tooltipStyle: {
    textAlign: "right",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default function MonthlyProgramPerformance({ selectedProgram }) {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    programs: [],
    loading: true,
    error: null,
  });

  // 🟢 جلب البيانات من API
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.programsPerformance}/monthly-program-performance/${selectedProgram}`,
        { headers: getCommonHeaders(userToken) }
      );

      if (!res.data || res.data.length === 0) {
        throw new Error("لا توجد بيانات متاحة.");
      }

      setState({ data: res.data, loading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        loading: false,
        error: "فشل تحميل بيانات أداء البرامج الشهري",
      });
      console.error("API Error:", err);
    }
  }, [userToken, selectedProgram]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  const renderContent = () => {
    if (state.error) {
      return <DataFetchError error={state.error} onRetry={handleRetry} />;
    }

    if (!state.data.length || !selectedProgram) {
      return (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة
        </div>
      );
    }

    if (!programData || !programData.monthlyData) {
      return (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة لهذا البرنامج
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={state.data.monthlyData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_CONFIG.gridStroke}
          />
          <XAxis
            dataKey="month"
            tick={{ fill: CHART_CONFIG.axisColor }}
            className="dark:text-gray-300"
          />
          <YAxis
            tick={{ fill: CHART_CONFIG.axisColor }}
            tickFormatter={(value) => value.toLocaleString()}
            className="dark:text-gray-300"
          />
          <Tooltip
            contentStyle={CHART_CONFIG.tooltipStyle}
            formatter={(value) => new Intl.NumberFormat("ar").format(value)}
          />
          <Area
            type="monotone"
            dataKey="beneficiaries"
            stackId="1"
            stroke={PROGRAM_COLORS[0]}
            fill={PROGRAM_COLORS[0] + "26"}
            strokeWidth={2}
            fillOpacity={0.2}
            name={selectedProgram}
            animationDuration={400}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              textAlign: "right",
            }}
            formatter={(value) => (
              <span className="text-gray-700 dark:text-gray-300">{value}</span>
            )}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return renderContent();
}
