"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { IconButton } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import API_ENDPOINTS from "@/config/apiEndPoints";

// الألوان لكل برنامج
const PROGRAM_COLORS = ["#4f46e5", "#059669", "#d97706", "#9333ea", "#dc2626"];

export default function AverageDonationPerProgramChart() {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
  });

  // 🟢 جلب البيانات من API
  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.financial}/average-donation-per-program`,
        { headers: getCommonHeaders(userToken) }
      );

      setState({ data: res.data, loading: false, error: null });
    } catch (error) {
      setState({ data: [], loading: false, error: "فشل تحميل بيانات متوسط التبرع لكل برنامج" });
      console.error("Fetch error:", error);
    }
  }, [userToken]);

  // 🔄 إعادة تحميل البيانات
  const handleRetry = () => {
    if (!state.loading) fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">متوسط حجم التبرع لكل برنامج</h3>
        <IconButton variant="text" onClick={handleRetry} className="dark:text-white">
          <IoReload className="w-5 h-5" />
        </IconButton>
      </div>

      {state.error ? (
        <DataFetchError error={state.error} onRetry={handleRetry} />
      ) : state.data.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">لا توجد بيانات متاحة</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={state.data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis dataKey="program" tick={{ fill: "#4a5568" }} />
            <YAxis tickFormatter={(value) => new Intl.NumberFormat("ar").format(value)} tick={{ fill: "#4a5568" }} />
            <Tooltip formatter={(value) => new Intl.NumberFormat("ar").format(value)} />
            <Legend wrapperStyle={{ paddingTop: "20px", textAlign: "right" }} />

            {/* إضافة المخططات لكل برنامج */}
            <Bar dataKey="averageDonation" fill={PROGRAM_COLORS[0]} name="متوسط التبرع" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
