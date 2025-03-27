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
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { BiFilter } from "react-icons/bi";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CONSTANTS from "@/config/constants";

// ✅ إعداد `SweetAlert2`
const MySwal = withReactContent(Swal);

// ✅ إعدادات المخطط
const CHART_CONFIG = {
  fillColor: "#4f46e5",
  xAxisKey: "program",
  dataKey: "engagement",
  label: "معدل التفاعل",
};

export default function ProgramsEngagementComparison() {
  const { userToken } = useCredentials();

  // ✅ إعداد الفلاتر الافتراضية
  const [filters, setFilters] = useState({
    orderBy: "engagementRate",
    order: "desc",
    limit: 5,
    startDate: "",
    endDate: "",
    programType: "",
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
        `${API_ENDPOINTS.DASHBOARDS.accountHealth}/programs-engagement-comparison?${queryParams}`,
        { headers: getCommonHeaders(userToken) }
      );

      setState({ data: res.data, loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: "فشل تحميل البيانات" });
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
          <select
            className="border border-borderColor rounded-md py-2 px-3"
            id="orderBy"
            defaultValue={filters.orderBy}
          >
            <option value="">ترتيب حسب</option>
            <option value="donations">عدد التبرعات</option>
            {/* <option value="engagementRate">معدل التفاعل</option>
            <option value="uniqueDonors">عدد المتبرعين الفريدين</option> */}
          </select>

          <select
            className="border border-borderColor rounded-md py-2 px-3"
            id="order"
            defaultValue={filters.order}
          >
            <option value="">ترتيب</option>
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>

          <Input
            label="عدد النتائج"
            id="limit"
            type="number"
            min="1"
            defaultValue={filters.limit}
          />

          <div className="flex  gap-3">
            <Input
              label="تاريخ البداية"
              id="startDate"
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

          <select
            id="programType"
            defaultValue={filters.programType}
            className="border border-borderColor rounded-md py-2 px-3"
          >
            {CONSTANTS.DONATION_SCOOP.map((scoop) => {
              return <option value={scoop.value}>{scoop.name}</option>;
            })}
            <option value="">كل البرامج</option>
          </select>
        </div>
      ),
      confirmButtonText: "تطبيق الفلترة",
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      preConfirm: () => {
        const orderBy = document.getElementById("orderBy").value;
        const order = document.getElementById("order").value;
        const limit = parseInt(document.getElementById("limit").value);
        const startDate = document.getElementById("startDate").value;
        const endDate = document.getElementById("endDate").value;
        const programType = document.getElementById("programType").value;

        // ✅ تحديث الفلاتر
        setFilters((prev) => ({
          ...prev,
          orderBy,
          order,
          limit: isNaN(limit) ? prev.limit : limit,
          startDate,
          endDate,
          programType,
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
      title="مقارنة معدلات التفاعل بين مختلف البرامج"
      description="يوضح هذا المخطط معدلات التفاعل لكل برنامج، مما يساعد في تحليل مدى تأثير الحملات المختلفة."
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
          <BarChart data={state.data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey={CHART_CONFIG.xAxisKey} tick={{ fill: "#4a5568" }} />
            <YAxis tickFormatter={(value) => `${value}%`} />
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
                  {CHART_CONFIG.label}
                </span>
              )}
            />
            <Bar
              dataKey={CHART_CONFIG.dataKey}
              fill={CHART_CONFIG.fillColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
