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
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { BiFilter } from "react-icons/bi";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// ✅ إعداد `SweetAlert2`
const MySwal = withReactContent(Swal);

// ✅ إعدادات المخطط
const CHART_CONFIG = {
  strokeColor: "#4f46e5",
  xAxisKey: "isoDate",
  dataKey: "growthRate",
  label: "معدل النمو (%)", // Added percentage symbol
};

export default function DonorGrowthOverTime() {
  const { userToken } = useCredentials();

  // ✅ إعداد الفلاتر الافتراضية
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
  });

  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  // ✅ جلب البيانات مع الفلاتر
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams(filters).toString();

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.accountHealth}/donor-growth-over-time?${queryParams}`,
        { headers: getCommonHeaders(userToken) }
      );

      setState({ data: res.data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: "فشل تحميل بيانات نمو المتبرعين",
      });
      console.error("Fetch error:", error);
    }
  }, [filters, userToken]);

  // ✅ فتح `SweetAlert2` لفلترة البيانات
  const fireSwal = useCallback(() => {
    MySwal.fire({
      title: "تصفية البيانات",
      customClass: {
        popup: "bg-mangoBlack",
      },
      html: (
        <div dir="rtl" className="flex flex-col gap-4 text-right">
          <div className="flex  gap-3">
            <div className="w-full sm:w-1/2">
              <Typography variant="h6">تاريخ البداية:</Typography>
              <Input
                id="startDate"
                type="date"
                defaultValue={filters.startDate}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <Typography variant="h6">تاريخ النهاية:</Typography>
              <Input id="endDate" type="date" defaultValue={filters.endDate} />
            </div>
          </div>
        </div>
      ),
      confirmButtonText: "تطبيق الفلترة",
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      preConfirm: () => {
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;

        // ✅ تحديث الفلاتر
        setFilters((prev) => ({
          ...prev,
          startDate,
          endDate,
        }));
      },
    });
  }, [filters]);

  // ✅ إعادة تحميل البيانات
  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FinancialChart
      action={
        <ButtonGroup color="green" variant="outlined" size="sm">
          <IconButton onClick={handleRetry} className="dark:text-white">
            <IoReload className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={fireSwal}>
            <BiFilter className="w-5 h-5" />
          </IconButton>
        </ButtonGroup>
      }
      title="نمو المتبرعين عبر الزمن"
      description="يوضح هذا المخطط التغير في عدد المتبرعين على مدار الأشهر، مما يساعد في تقييم استراتيجيات الجذب والاحتفاظ بالمتبرعين."
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
                new Intl.NumberFormat("ar", {
                  style: "percent",
                  maximumFractionDigits: 2,
                }).format(value / 100)
              }
            />
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat("ar", {
                  style: "percent",
                  maximumFractionDigits: 2,
                }).format(value / 100)
              }
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
