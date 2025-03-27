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
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";
import {
  IconButton,
  ButtonGroup,
  Button,
  Select,
  Option,
  Checkbox,
} from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { BsBarChart, BsGraphUp } from "react-icons/bs";
import { MdCalendarMonth, MdFilterList } from "react-icons/md";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// تكوين المخطط
const CHART_CONFIG = {
  fillColor: "#4f46e5",
  xAxisKey: "period",
  dataKey: "totalDonations",
  label: "إجمالي التبرعات",
};

// قائمة الأشهر بالعربية
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

export default function TotalDonationsOverPeriods() {
  const { userToken } = useCredentials();
  const [chartType, setChartType] = useState("bar"); // حالة تبديل المخطط
  const [viewType, setViewType] = useState("monthly"); // عرض البيانات حسب الشهر أو اليوم
  const [selectedMonths, setSelectedMonths] = useState([
    new Date().getMonth() + 1,
  ]); // الأشهر المختارة
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams({
        viewType,
        selectedMonths: selectedMonths.join(","),
      }).toString();

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.executiveSummary}/Total-donations-over-periods?${queryParams}`,
        {
          headers: getCommonHeaders(userToken),
        }
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
        error: "فشل تحميل بيانات التبرعات التاريخية",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken, viewType, selectedMonths]);

  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // مكون المخطط بناءً على نوع المخطط المختار
  const renderChart = () => {
    if (state.error) {
      return <DataFetchError error={state.error} onRetry={handleRetry} />;
    }

    if (state.data.length === 0) {
      return (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "bar" ? (
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
            <Legend />
            <Bar
              dataKey={CHART_CONFIG.dataKey}
              fill={CHART_CONFIG.fillColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        ) : (
          <LineChart data={state.data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey={CHART_CONFIG.xAxisKey} tick={{ fill: "#4a5568" }} />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("ar").format(value)
              }
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={CHART_CONFIG.dataKey}
              stroke={CHART_CONFIG.fillColor}
              strokeWidth={2}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <FinancialChart
      action={
        <div className="flex items-center gap-2">
          <ButtonGroup size="sm" color="green" variant="outlined">
            <Button onClick={() => setChartType("bar")}>
              <BsBarChart className="w-5 h-5" />
            </Button>
            <Button onClick={() => setChartType("line")}>
              <BsGraphUp className="w-5 h-5" />
            </Button>
            <Button variant="gradient" onClick={handleRetry}>
              <IoReload className="w-5 h-5" />
            </Button>
            <Button variant="gradient" onClick={fireSwal}>
              <MdCalendarMonth className="w-5 h-5" />
            </Button>
          </ButtonGroup>
        </div>
      }
      title="إجمالي التبرعات عبر الفترات"
      description="يمكنك تخصيص عرض البيانات عبر الأشهر أو الأيام."
      loading={state.loading}
    >
      {renderChart()}
    </FinancialChart>
  );
}
