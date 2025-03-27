"use client";
import { CustomTooltip } from "@/components/dashboards/CustomTooltip";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import {
  IconButton,
  ButtonGroup,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { IoReload } from "react-icons/io5";
import { BiFilter } from "react-icons/bi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

// ✅ إعداد `SweetAlert2`
const MySwal = withReactContent(Swal);

// ✅ إعداد ألوان المخطط
const BAR_COLORS = {
  donations: { fill: "#4f46e5", name: "عدد التبرعات" },
  shares: { fill: "#059669", name: "عدد المشاركات" },
};

// ✅ إعدادات المخطط
const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  gridStroke: "#e5e7eb",
  barRadius: [4, 4, 0, 0],
  tooltipStyle: {
    textAlign: "right",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default function DonorInteractions() {
  const { userToken } = useCredentials();

  // ✅ إعداد الفلاتر الافتراضية
  const [filters, setFilters] = useState({
    orderBy: "donations",
    order: "desc",
    limit: 10,
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
        `${API_ENDPOINTS.DASHBOARDS.programsPerformance}/donor-interactions?${queryParams}`,
        { headers: getCommonHeaders(userToken) }
      );

      setState({ data: res.data, loading: false, error: null });
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? "يجب تسجيل الدخول لعرض البيانات"
          : "فشل تحميل البيانات. يرجى المحاولة مرة أخرى لاحقًا.";

      setState({ error: errorMessage, loading: false, data: [] });
      console.error("API Error:", err);
    }
  }, [filters, userToken]);

  // ✅ فتح `SweetAlert2` لفلترة البيانات
  const fireSwal = useCallback(() => {
    MySwal.fire({
      title: "تصفية النتائج",
      customClass: {
        popup: "bg-mangoBlack",
      },
      html: (
        <div dir="rtl" className="flex flex-col gap-4 text-right">
          {/* ترتيب البيانات */}
          <label className="text-sm font-semibold">🔹 ترتيب حسب:</label>
          <select
            className="border border-borderColor p-2 rounded-md "
            id="orderBy"
            defaultValue={filters.orderBy}
          >
            <option value="donations">عدد التبرعات</option>
            <option value="shares">عدد المشاركات</option>
          </select>

          <label className="text-sm font-semibold">🔹 ترتيب:</label>
          <select
            className="border border-borderColor p-2 rounded-md "
            id="order"
            defaultValue={filters.order}
          >
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>

          {/* عدد النتائج ونطاق التاريخ */}
          <label className="text-sm font-semibold">عدد النتائج:</label>
          <Input
            id="limit"
            type="number"
            defaultValue={filters.limit}
            min="1"
            max="20"
          />
          <div className="flex gap-3">
            <Input
              id="startDate"
              label="تاريخ البداية:"
              type="date"
              defaultValue={filters.startDate}
            />

            <Input
              label="تاريخ النهاية"
              id="endDate"
              type="date"
              defaultValue={filters.endDate}
            />
          </div>
        </div>
      ),
      confirmButtonText: "تطبيق الفلترة",
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      preConfirm: () => {
        const orderBy = document.getElementById("orderBy").value;
        const order = document.getElementById("order").value;
        const limit = document.getElementById("limit").value;
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        // ✅ تحديث الفلاتر
        setFilters({ orderBy, order, limit, startDate, endDate });
      },
    });
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <FinancialChart
      action={
        <ButtonGroup color="green" variant="outlined" size="sm">
          <IconButton onClick={fetchData}>
            <IoReload className="w-5 h-5" />
          </IconButton>
          <IconButton onClick={fireSwal}>
            <BiFilter className="w-5 h-5" />
          </IconButton>
        </ButtonGroup>
      }
      title="تفاعلات المتبرعين"
      description="عدد التبرعات والمشاركات حسب البرنامج"
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
          <BarChart data={state.data} margin={CHART_CONFIG.margin}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_CONFIG.gridStroke}
            />
            <XAxis dataKey="program" angle={-15} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip
              content={<CustomTooltip />}
              contentStyle={CHART_CONFIG.tooltipStyle}
            />
            <Legend />
            <Bar
              dataKey="donations"
              fill={BAR_COLORS.donations.fill}
              radius={CHART_CONFIG.barRadius}
            />
            <Bar
              dataKey="shares"
              fill={BAR_COLORS.shares.fill}
              radius={CHART_CONFIG.barRadius}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
