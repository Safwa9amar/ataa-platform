"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import API_ENDPOINTS from "@/config/apiEndPoints";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { IconButton, Option, Select } from "@material-tailwind/react";
import { IoReload } from "react-icons/io5";

const RateOfCompletedProgramsChart = () => {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayType, setDisplayType] = useState("monthly");
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.executiveSummary}/rate-of-completed-programs?displayType=${displayType}`,
        { headers: getCommonHeaders(userToken) }
      );

      if (!res.data || res.data.length === 0) {
        throw new Error("لا توجد بيانات متاحة.");
      }

      setData(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("فشل تحميل بيانات معدل البرامج المكتملة.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchData();
  }, [displayType, userToken]);

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <FinancialChart
      title={
        displayType === "daily"
          ? "معدل إكمال البرامج اليومي خلال الشهر الحالي"
          : "معدل إكمال البرامج الشهري خلال السنة الجارية"
      }
      action={
        <div className="flex gap-2 items-center">
          <IconButton color="green" variant="outlined" onClick={fetchData}>
            <IoReload />
          </IconButton>
          <Select
            value={displayType}
            onChange={(val) => setDisplayType(val)}
            color="green"
          >
            <Option value="daily">يومي</Option>
            <Option value="monthly">شهري</Option>
          </Select>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={displayType === "daily" ? "day" : "month"}
            tickFormatter={(value) =>
              displayType === "daily" ? `اليوم ${value}` : value
            }
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]} // المحور Y من 0 إلى 100
          />
          <Tooltip
            formatter={(value) => `${value.toFixed(2)}%`}
            labelFormatter={(label) =>
              displayType === "daily" ? `اليوم ${label}` : label
            }
          />
          <Legend />
          <Bar dataKey="completionRate" fill="#4f46e5" name="معدل الإكمال" />
        </BarChart>
      </ResponsiveContainer>
    </FinancialChart>
  );
};

export default RateOfCompletedProgramsChart;
