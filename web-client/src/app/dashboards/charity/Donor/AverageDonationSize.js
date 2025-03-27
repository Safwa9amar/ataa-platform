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
import {
  IconButton,
  Select,
  Option,
  ButtonGroup,
  Button,
} from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";

// 🟢 إعدادات المخطط
const CHART_CONFIG = {
  strokeColor: "#4f46e5",
  xAxisKey: "period",
  dataKey: "averageDonation",
  label: "متوسط حجم التبرع",
};

// 🟢 قائمة الأشهر بالعربية
const MONTHS = [
  { name: "يناير", value: 1 },
  { name: "فبراير", value: 2 },
  { name: "مارس", value: 3 },
  { name: "أبريل", value: 4 },
  { name: "مايو", value: 5 },
  { name: "يونيو", value: 6 },
  { name: "يوليو", value: 7 },
  { name: "أغسطس", value: 8 },
  { name: "سبتمبر", value: 9 },
  { name: "أكتوبر", value: 10 },
  { name: "نوفمبر", value: 11 },
  { name: "ديسمبر", value: 12 },
];

export default function AverageDonationSize() {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const [viewType, setViewType] = useState("monthly"); // العرض: شهري أو يومي
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // الشهر المختار عند العرض اليومي

  // 🟢 جلب البيانات من API
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams({
        viewType,
        selectedMonth: selectedMonth.toString(),
      }).toString();

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.donor}/average-donation-size?${queryParams}`,
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
        error: "فشل تحميل بيانات متوسط حجم التبرع",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken, viewType, selectedMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FinancialChart
      action={
        <div dir="rtl" className="flex items-center gap-3">
          {/* زر اختيار العرض شهري أو يومي */}
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="border border-borderColor py-0 px-4 rounded-md "
          >
            <option value="monthly">شهري</option>
            <option value="daily">يومي</option>
          </select>

          {/* اختيار الشهر في حالة العرض اليومي */}
          {viewType === "daily" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="border border-borderColor py-0 px-4 rounded-md "
            >
              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.name}
                </option>
              ))}
            </select>
          )}

          {/* زر إعادة تحميل البيانات */}
          <IconButton
            variant="text"
            onClick={fetchData}
            className="dark:text-white"
          >
            <IoReload className="w-5 h-5" />
          </IconButton>
        </div>
      }
      title="متوسط حجم التبرع بمرور الوقت"
      description={`يعرض هذا المخطط متوسط حجم التبرع ${
        viewType === "monthly" ? "شهريًا" : "يوميًا"
      }، مما يساعد في تحليل أنماط التبرع.`}
      loading={state.loading}
    >
      {state.error ? (
        <DataFetchError error={state.error} onRetry={fetchData} />
      ) : state.data.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={state.data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey={CHART_CONFIG.xAxisKey} tick={{ fill: "#4a5568" }} />
            <YAxis tickFormatter={(value) => `${value?.toFixed(2)}`} />
            <Tooltip
              formatter={(value) => `${value?.toFixed(2)}`}
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
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
