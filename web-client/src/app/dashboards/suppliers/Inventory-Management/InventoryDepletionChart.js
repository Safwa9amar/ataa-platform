"use client";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import {
  ButtonGroup,
  IconButton,
  Select,
  Option,
} from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const InventoryDepletionChart = () => {
  const { userToken } = useCredentials();
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // جلب البيانات من API
  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        API_ENDPOINTS.DASHBOARDS.SUPPLIERS +
          "inventory-management/inventory-depletion",
        {
          headers: getCommonHeaders(userToken),
        }
      );
      setData(res.data);
      if (res.data.length > 0) {
        setSelectedProduct(res.data[0].productId);
      }
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

  const selectedProductData = data.find(
    (product) => product.productId === selectedProduct
  );

  return (
    <FinancialChart
      action={
        <div className="flex items-center gap-3" dir="rtl">
          <Select
            value={selectedProduct}
            onChange={(value) => setSelectedProduct(value)}
            label="اختر المنتج"
            className="mb-4"
          >
            {data.map((product) => (
              <Option key={product.productId} value={product.productId}>
                {product.productName}
              </Option>
            ))}
          </Select>
          <IconButton
            color="green"
            variant="outlined"
            size="sm"
            onClick={getData}
            className="dark:text-white"
          >
            <IoReload className="w-5 h-5" />
          </IconButton>
        </div>
      }
      title={"سجل المخزون لكل منتج بمرور الوقت"}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={selectedProductData?.stockHistory || []}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="inventoryLevel"
            stroke="#059669"
            fill="#10B981"
            name={selectedProductData?.productName || "منتج"}
          />
        </AreaChart>
      </ResponsiveContainer>
    </FinancialChart>
  );
};

export default InventoryDepletionChart;
