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
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { IconButton, ButtonGroup, Button } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { BsPieChartFill, BsBarChartFill } from "react-icons/bs"; // أيقونات التبديل بين المخططات

// ألوان المخطط الدائري
const COLORS = ["#4f46e5", "#059669", "#d97706", "#9333ea", "#dc2626"];

// إعدادات المخططات
const CHART_CONFIG = {
  dataKey: "value",
  nameKey: "name",
  outerRadius: 80,
  fillColor: "#4f46e5",
  xAxisKey: "name",
};

export default function SuccessfullyCompletedPrograms() {
  const { userToken } = useCredentials();
  const [chartType, setChartType] = useState("pie"); // تبديل بين PieChart و BarChart
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.executiveSummary}/successfully-completed-programs`,
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
        error: "فشل تحميل بيانات البرامج المكتملة",
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

  // مكون المخطط بناءً على نوع المخطط المختار
  const renderChart = () => {
    if (state.error) {
      return <DataFetchError error={state.error} onRetry={handleRetry} />;
    }

    if (state.data.length === 0) {
      return (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد برامج مكتملة
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "pie" ? (
          <PieChart>
            <Pie
              data={state.data}
              dataKey={CHART_CONFIG.dataKey}
              nameKey={CHART_CONFIG.nameKey}
              cx="50%"
              cy="50%"
              outerRadius={CHART_CONFIG.outerRadius}
              fill={CHART_CONFIG.fillColor}
              label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {state.data?.map((entry, index) => (
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
              verticalAlign="bottom"
              align="center"
              iconSize={12}
              iconType="circle"
              wrapperStyle={{
                paddingLeft: "20px",
                fontSize: "14px",
                direction: "rtl",
              }}
              formatter={(value) => (
                <span className="mr-2 text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />
          </PieChart>
        ) : (
          <BarChart barSize={20} data={state.data}>
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
              align="center"
              formatter={() => (
                <span className="text-gray-700 dark:text-gray-300">
                  عدد البرامج المكتملة
                </span>
              )}
            />
            <Bar
              dataKey={CHART_CONFIG.dataKey}
              fill={CHART_CONFIG.fillColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <FinancialChart
      action={
        <ButtonGroup color="green" variant="outlined" size="sm">
          {/* <Button onClick={() => setChartType("pie")} color="blue">
            <BsPieChartFill className="w-5 h-5" />
          </Button>
          <Button onClick={() => setChartType("bar")} color="blue">
            <BsBarChartFill className="w-5 h-5" />
          </Button> */}
          <Button
            variant="text"
            onClick={handleRetry}
            className="dark:text-white"
          >
            <IoReload className="w-5 h-5" />
          </Button>
        </ButtonGroup>
      }
      title="البرامج المكتملة بنجاح"
      description="يوضح هذا المخطط عدد البرامج التي تم إكمالها بنجاح. يمكن استخدامه لتتبع التقدم في تنفيذ البرامج"
      loading={state.loading}
    >
      {renderChart()}
    </FinancialChart>
  );
}
