import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
import React, { useReducer, useEffect, useCallback } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { IconButton } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";

// 🎨 ألوان الأنشطة المختلفة
const ACTIVITY_COLORS = {
  تشغيلية: "#4f46e5",
  إدارية: "#059669",
  "غير تشغيلية": "#d97706",
};

// 🎯 حالة البيانات الأولية
const initialState = {
  data: [],
  loading: true,
  error: null,
};

// 📌 الدالة المختصرة لإدارة الحالة
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { data: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { data: [], loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ExpenseDistributionByActivity() {
  const { userToken } = useCredentials();
  const [state, dispatch] = useReducer(reducer, initialState);

  // 🟢 جلب البيانات من الـ API
  const fetchData = useCallback(async () => {
    dispatch({ type: "FETCH_START" });

    try {
      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.financial}/expense-distribution-by-activity`,
        { headers: getCommonHeaders(userToken) }
      );
      dispatch({ type: "FETCH_SUCCESS", payload: res.data });
    } catch (error) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "فشل تحميل بيانات توزيع النفقات",
      });
      console.error("Fetch error:", error);
    }
  }, [userToken]);

  // ⏳ إلغاء الطلب عند التنقل أو إعادة التحميل
  useEffect(() => {
    const controller = new AbortController();
    fetchData();
    return () => controller.abort();
  }, [fetchData]);

  // 🔄 إعادة المحاولة عند الفشل
  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  return (
    <FinancialChart
      action={
        <IconButton
          variant="text"
          onClick={handleRetry}
          className="dark:text-white"
        >
          <IoReload className="w-5 h-5" />
        </IconButton>
      }
      title="توزيع النفقات عبر الأنشطة"
      description="يوضح هذا المخطط توزيع النفقات عبر مختلف الأنشطة والبرامج"
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
          <BarChart
            data={state.data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="period"
              angle={-45}
              textAnchor="end"
              tick={{ fill: "#4a5568" }}
              height={70}
              className="dark:text-gray-300"
            />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("ar").format(value)
              }
              tick={{ fill: "#4a5568" }}
              className="dark:text-gray-300"
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
              wrapperStyle={{ paddingTop: "20px", textAlign: "right" }}
              formatter={(value) => (
                <span className="text-gray-700 dark:text-gray-300">
                  {value}
                </span>
              )}
            />

            {/* عرض الأعمدة بناءً على الأنشطة */}
            {Object.keys(ACTIVITY_COLORS).map((activity) => (
              <Bar
                key={activity}
                dataKey={activity}
                stackId="a"
                fill={ACTIVITY_COLORS[activity]}
                radius={[4, 4, 0, 0]}
                animationDuration={500}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </FinancialChart>
  );
}
