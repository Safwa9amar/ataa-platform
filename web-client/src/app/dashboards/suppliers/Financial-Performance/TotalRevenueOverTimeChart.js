"use client";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import { ButtonGroup, IconButton } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TotalRevenueOverTimeChart = () => {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب البيانات من API
  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        API_ENDPOINTS.DASHBOARDS.SUPPLIERS +
          "financial-performance/total-revenue-over-time",
        {
          headers: getCommonHeaders(userToken),
        }
      );
      setData(res.data);
    } catch (error) {
      setError("حدث خطأ ما يرجى اعادة التحميل");
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    getData();
  }, []);

  // عرض رسالة الخطأ في حالة وجود خطأ
  if (error) return <DataFetchError error={error} onRetry={getData} />;

  return (
    <FinancialChart
      action={
        <ButtonGroup color="green" variant="outlined" size="sm">
          <IconButton onClick={getData} className="dark:text-white">
            <IoReload className="w-5 h-5" />
          </IconButton>
        </ButtonGroup>
      }
      title={"تغييرات إجمالي الإيرادات بمرور الوقت"}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#059669"
            name="الإيرادات"
          />
        </LineChart>
      </ResponsiveContainer>
    </FinancialChart>
  );
};

export default TotalRevenueOverTimeChart;
