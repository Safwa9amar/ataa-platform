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
import { IconButton, Button, ButtonGroup } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// 🟢 إعدادات المخطط
const CHART_CONFIG = {
  strokeColor: "#4f46e5",
  xAxisKey: "period",
  dataKey: "growthRate",
  label: "معدل نمو قاعدة المتبرعين",
};

// 🟢 تكامل SweetAlert2 مع React
const mySwal = withReactContent(Swal);

export default function DonorGrowthRate() {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1)
      .toISOString()
      .split("T")[0], // أول يوم في السنة الحالية
    endDate: new Date().toISOString().split("T")[0], // اليوم الحالي
  });

  // 🟢 استرجاع البيانات من API
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams(dateRange).toString();

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.donor}/donor-growth-rate?${queryParams}`,
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
        error: "فشل تحميل بيانات معدل نمو قاعدة المتبرعين",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken, dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🟢 عرض نافذة اختيار التواريخ
  const handleDateSelection = () => {
    mySwal.fire({
      title: "📅 حدد نطاق التاريخ",
      html: (
        <div dir="rtl" className="flex flex-col gap-4 text-right">
          <label className="font-semibold text-gray-700">دعم العرض :</label>
          <select
            id="viewType"
            className="border border-gray-300 rounded-lg p-2 w-full"
            defaultValue="monthly"
            onChange={(e) =>
              setDateRange({ ...dateRange, viewType: e.target.value })
            }
          >
            <option value="daily">يومي</option>
            <option value="monthly">شهري</option>
          </select>
          <label className="font-semibold text-gray-700">من:</label>
          <input
            id="startDate"
            type="date"
            defaultValue={dateRange.startDate}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />

          <label className="font-semibold text-gray-700">إلى:</label>
          <input
            id="endDate"
            type="date"
            defaultValue={dateRange.endDate}
            className="border border-gray-300 rounded-lg p-2 w-full"
          />
        </div>
      ),
      confirmButtonText: "تحديث البيانات",
      preConfirm: () => {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        if (!startDate || !endDate || startDate > endDate) {
          mySwal.showValidationMessage("يرجى اختيار نطاق زمني صحيح!");
          return false;
        }

        setDateRange({ startDate, endDate });
        fetchData();
      },
    });
  };

  return (
    <FinancialChart
      action={
        <ButtonGroup variant="outlined" size="sm" color="green">
          <IconButton variant="text" onClick={fetchData}>
            <IoReload className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={handleDateSelection}>
            <MdCalendarMonth className="w-5 h-5" />
          </IconButton>
        </ButtonGroup>
      }
      title="معدل نمو قاعدة المتبرعين"
      description={`يظهر هذا المخطط معدل نمو قاعدة المتبرعين خلال الفترة من ${dateRange.startDate} إلى ${dateRange.endDate}.`}
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
            <XAxis
              dataKey={CHART_CONFIG.xAxisKey}
              tick={{ fill: "#4a5568" }}
              className="dark:text-gray-300"
            />
            <YAxis
              tickFormatter={(value) => `${value.toFixed(1)}%`}
              className="dark:text-gray-300"
              domain={[0, "auto"]}
            />
            <Tooltip
              formatter={(value) => `${value?.toFixed(1)}%`}
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
