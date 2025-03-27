"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CustomTooltip } from "@/components/dashboards/CustomTooltip";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
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
import {
  ButtonGroup,
  IconButton,
  Input,
  Option,
  Select,
} from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { BiFilter } from "react-icons/bi";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import CONSTANTS from "@/config/constants";

// 🟢 إعدادات المخطط
const CHART_CONFIG = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  barCategoryGap: 15,
  barRadius: [4, 4, 0, 0],
  animationDuration: 400,
  gridStrokeOpacity: 0.2,
  tooltipStyle: {
    textAlign: "right",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

// 🟢 تهيئة SweetAlert
const MySwal = withReactContent(Swal);

export default function DistributionDonationsProgramPeriod() {
  const { userToken } = useCredentials();
  const [filters, setFilters] = useState({
    minAmount: "all",
    order: "desc",
    limit: 10,
    startDate: "2024-01-01",
    endDate: "2024-06-01",
    programType: "",
    periodType: "daily",
  });

  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  // 🟢 جلب البيانات من API مع تمرير الفلاتر
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const queryParams = new URLSearchParams(filters).toString();

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.programsPerformance}/distribution-donations-program-period?${queryParams}`,
        { headers: getCommonHeaders(userToken) }
      );

      console.log(res.data);

      setState({ data: res.data, loading: false, error: null });
    } catch (err) {
      setState({
        data: [],
        loading: false,
        error: "فشل تحميل بيانات توزيع التبرعات",
      });
      console.error("API Error:", err);
    }
  }, [userToken, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  // 🟢 نافذة الفلاتر باستخدام SweetAlert
  const fireSwal = useCallback(() => {
    MySwal.fire({
      title: "🔍 تخصيص عرض البيانات",
      html: (
        <div dir="rtl" className="flex flex-col gap-4 text-right">
          {/* الترتيب */}
          <label>🔹 ترتيب حسب:</label>
          <select
            id="minAmount"
            className="border border-borderColor p-2 rounded-md "
            defaultValue={filters.minAmount}
          >
            <option value="all">عرض جميع البرامج</option>
            <option value="minAmount">عرض البرامج التي حصلت على تبرعات</option>
          </select>

          {/* تصاعدي / تنازلي */}
          <label>🔹 ترتيب:</label>
          <select
            className="border border-borderColor p-2 rounded-md "
            id="order"
            defaultValue={filters.order}
          >
            <option value="desc">تنازلي</option>
            <option value="asc">تصاعدي</option>
          </select>

          {/* عدد النتائج */}
          <Input
            label="عدد البرامج:"
            id="limit"
            type="number"
            defaultValue={filters.limit}
            min="1"
          />

          {/* الفلاتر الزمنية */}
          <div className="flex  gap-3">
            <Input
              id="startDate"
              type="date"
              label="تاريخ البداية:"
              defaultValue={filters.startDate}
            />

            <Input
              label="تاريخ النهاية:"
              id="endDate"
              type="date"
              defaultValue={filters.endDate}
            />
          </div>

          {/* نوع البرنامج */}
          <label>🔹 نوع البرنامج:</label>
          <select
            id="programType"
            defaultValue={filters.programType}
            className="border border-borderColor p-2 rounded-md "
          >
            <option value="">كل البرامج</option>
            {CONSTANTS.DONATION_SCOOP.map((el) => (
              <option value={el.value}>{el.name}</option>
            ))}
          </select>
        </div>
      ),
      confirmButtonText: "تطبيق الفلاتر",
      preConfirm: () => {
        setFilters({
          minAmount: document.getElementById("minAmount").value,
          order: document.getElementById("order").value,
          limit: document.getElementById("limit").value,
          startDate: document.getElementById("startDate").value,
          endDate: document.getElementById("endDate").value,
          programType: document.getElementById("programType").value,
          periodType: filters.periodType,
        });
      },
    });
  }, [filters]);

  return (
    <FinancialChart
      action={
        <div className="flex items-center gap-3">
          <ButtonGroup color="green" variant="outlined" size="sm">
            <IconButton onClick={handleRetry}>
              <IoReload className="w-5 h-5" />
            </IconButton>
            <IconButton onClick={fireSwal}>
              <BiFilter className="w-5 h-5" />
            </IconButton>
          </ButtonGroup>
          <select
            dir="rtl"
            className="border border-green-500 text-green-500  p-2 px-4 text-xs rounded-xl"
            label="اختر الدورة الزمنية"
            value={filters.periodType}
            onChange={(e) =>
              setFilters({ ...filters, periodType: e.target.value })
            }
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
            <option value="quarterly"> سنوي</option>
          </select>
        </div>
      }
      title="توزيع التبرعات حسب البرنامج والفترة الزمنية"
      description="التوزيع التفصيلي للتبرعات حسب البرنامج والفصل الزمني"
      loading={state.loading}
    >
      {state.error ? (
        <DataFetchError error={state.error} onRetry={handleRetry} />
      ) : state.data.programs?.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={state.data.programs}
            margin={CHART_CONFIG.margin}
            barCategoryGap={CHART_CONFIG.barCategoryGap}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={CHART_CONFIG.gridStrokeOpacity}
            />
            <XAxis
              dataKey="program"
              tick={{ fill: "#6b7280" }}
              angle={-15}
              textAnchor="end"
              height={70}
            />

            <Tooltip
              content={<CustomTooltip />}
              contentStyle={CHART_CONFIG.tooltipStyle}
            />
            <Legend align="right" />
            {state.data.periods?.map((period) => (
              <Bar
                key={period}
                dataKey={period}
                stackId="a"
                fill={state.data?.colors[period].light}
                radius={CHART_CONFIG.barRadius}
                barSize={20}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
