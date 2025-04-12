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
  Button,
  ButtonGroup,
  Select,
  Option,
  Checkbox,
  Input,
} from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { MdCalendarMonth } from "react-icons/md";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// 🟢 إعدادات المخطط
const CHART_CONFIG = {
  strokeColor: "#4f46e5",
  xAxisKey: "period",
  lineKey: "growthRate",
  lineName: "معدل نمو التبرعات",
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

const mySwal = withReactContent(Swal);

export default function DonationGrowthRate() {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const [viewType, setViewType] = useState("daily"); // شهري أو يومي
  const [selectedMonths, setSelectedMonths] = useState([
    new Date().getMonth() + 1,
  ]); // الأشهر المختارة
  const [year, setYear] = useState(new Date().getFullYear());

  // 🟢 جلب البيانات من API
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams({
        viewType,
        selectedMonths: selectedMonths.join(","),
        year,
      }).toString();

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.executiveSummary}/donation-growth-rate?${queryParams}`,
        { headers: getCommonHeaders(userToken) }
      );

      setState({ data: res.data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: "فشل تحميل بيانات معدل نمو التبرعات",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken, viewType, selectedMonths]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  // 🟢 نافذة تخصيص الفلاتر
  const fireSwal = useCallback(async () => {
    mySwal.fire({
      title: "🔍 تخصيص عرض البيانات",
      html: (
        <div dir="rtl" className="flex flex-col gap-4 text-right">
          {/* اختيار طريقة العرض */}
          <label className="font-semibold text-gray-700">عرض حسب:</label>
          <select
            id="viewType"
            defaultValue={viewType}
            className="border border-gray-300 rounded-lg p-2 w-full"
          >
            <option value="monthly">شهري</option>
            <option value="daily">يومي</option>
          </select>

          {/* اختيار الأشهر */}
          <label className="font-semibold text-gray-700">
            الأشهر المختارة:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month) => (
              <label key={month.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="selectedMonths"
                  value={month.value}
                  defaultChecked={selectedMonths.includes(month.value)}
                  className="form-checkbox h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                {month.name}
              </label>
            ))}
          </div>
        </div>
      ),
      confirmButtonText: "تطبيق الفلاتر",
      preConfirm: () => {
        // 🟢 جلب القيم المختارة من عناصر HTML
        let newViewType = document.getElementById("viewType").value;
        let newSelectedMonths = Array.from(
          document.getElementsByName("selectedMonths")
        )
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => parseInt(checkbox.value, 10));

        // 🟢 التحقق من أنه عند اختيار "يومي" يجب أن يكون هناك شهر واحد فقط
        if (newViewType === "daily" && newSelectedMonths.length !== 1) {
          mySwal.showValidationMessage(
            "عند اختيار العرض اليومي، يجب تحديد شهر واحد فقط."
          );
          return false;
        }

        // 🟢 تحديث الحالة وإعادة تحميل البيانات
        setSelectedMonths(newSelectedMonths);
        setViewType(newViewType);
      },
    });
  }, [selectedMonths, viewType, fetchData]);

  return (
    <FinancialChart
      action={
        <ButtonGroup color="green" size="sm" variant="outlined">
          {/* زر إعادة تحميل البيانات */}
          <IconButton variant="gradient" onClick={handleRetry}>
            <IoReload className="w-5 h-5" />
          </IconButton>

          {/* زر تخصيص الفلاتر */}
          {/* <IconButton variant="gradient" onClick={fireSwal}>
            <MdCalendarMonth className="w-5 h-5" />
          </IconButton> */}
        </ButtonGroup>
      }
      // بناءً على الأشهر أو الأيام المحددة
      title="معدل نمو التبرعات"
      description="يعرض هذا المخطط معدل نمو التبرعات ."
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
            <XAxis
              dataKey={CHART_CONFIG.xAxisKey}
              className="dark:text-gray-300"
              tick={{ fill: "#4a5568" }}
            />
            <YAxis
              className="dark:text-gray-300"
              tickFormatter={(value) => `${value}%`}
            />
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
              formatter={() => (
                <span className="text-gray-700 dark:text-gray-300">
                  {CHART_CONFIG.lineName}
                </span>
              )}
            />
            <Line
              type="monotone"
              dataKey={CHART_CONFIG.lineKey}
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
