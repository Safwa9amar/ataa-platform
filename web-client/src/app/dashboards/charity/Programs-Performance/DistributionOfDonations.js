"use client";

import { CustomTooltip } from "@/components/dashboards/CustomTooltip";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import { ButtonGroup, IconButton, Input } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { IoReload } from "react-icons/io5";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// Constants
const COLORS = [
  "#4f46e5", // Indigo-600
  "#2563eb", // Blue-600
  "#059669", // Emerald-600
  "#d97706", // Amber-600
  "#dc2626", // Red-600
  "#9333ea", // Purple-600
  "#67e8f9", // Cyan-600
];

const CHART_CONFIG = {
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  outerRadius: 120,
  innerRadius: 70,
  paddingAngle: 2,
  animationDuration: 400,
  animationBegin: 100,
  strokeWidth: 2,
};

export default function DistributionOfDonations(props) {
  const { userToken } = useCredentials();
  const [state, setState] = useState({
    data: [],
    loading: true,
    error: null,
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalPages: 1,
      totalCount: 0,
    },
  });

  const fetchData = useCallback(
    async (page = 1, pageSize = 10) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const res = await axios.get(
          `${API_ENDPOINTS.DASHBOARDS.programsPerformance}/distribution-of-donations`,
          {
            headers: getCommonHeaders(userToken),
            params: {
              page,
              pageSize,
            },
          }
        );

        let fetchedData = res.data.data || [];
        const {
          currentPage,
          pageSize: resPageSize,
          totalPages,
          totalCount,
        } = res.data.pagination;

        // 🟢 فصل البيانات إلى برامج ذات تبرعات وبرامج بدون تبرعات
        let programsWithDonations = fetchedData.filter(
          (program) => program.value > 0
        );
        let programsWithoutDonations = fetchedData.filter(
          (program) => program.value === 0
        );

        // 🟢 تجميع البرامج التي لم تحصد تبرعات في عنصر واحد
        if (programsWithoutDonations.length > 0) {
          const totalZeroDonations = programsWithoutDonations.reduce(
            (sum, program) => sum + program.value,
            0
          );
          programsWithDonations.push({
            name: "باقي البرامج التي لم تحصد تبرعات",
            value: totalZeroDonations,
          });
        }

        setState({
          data: programsWithDonations,
          loading: false,
          error: null,
          pagination: {
            currentPage,
            pageSize: resPageSize,
            totalPages,
            totalCount,
          },
        });
      } catch (err) {
        setState({
          data: [],
          loading: false,
          error: "فشل تحميل بيانات توزيع التبرعات",
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalPages: 1,
            totalCount: 0,
          },
        });
        console.error("API Error:", err);
      }
    },
    [userToken]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(state.pagination.currentPage, state.pagination.pageSize);
    return () => controller.abort();
  }, [fetchData]);

  const handleRetry = () => {
    if (!state.loading)
      fetchData(state.pagination.currentPage, state.pagination.pageSize);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= state.pagination.totalPages) {
      setState((prev) => ({
        ...prev,
        pagination: { ...prev.pagination, currentPage: newPage },
      }));
      fetchData(newPage, state.pagination.pageSize);
    }
  };

  const renderContent = () => {
    if (state.error) {
      return <DataFetchError error={state.error} onRetry={handleRetry} />;
    }

    if (!state.data?.length) {
      return (
        <div className="text-gray-500 dark:text-gray-400 text-center py-8">
          لا توجد بيانات متاحة
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart margin={CHART_CONFIG.margin}>
          <Pie
            data={state.data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={CHART_CONFIG.outerRadius}
            innerRadius={CHART_CONFIG.innerRadius}
            paddingAngle={CHART_CONFIG.paddingAngle}
            labelLine={false}
            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            animationDuration={CHART_CONFIG.animationDuration}
            animationBegin={CHART_CONFIG.animationBegin}
          >
            {state.data.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={CHART_CONFIG.strokeWidth}
              />
            ))}
          </Pie>

          <Tooltip
            content={<CustomTooltip />}
            formatter={(value) => new Intl.NumberFormat("ar").format(value)}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <FinancialChart
      action={
        <div className="flex items-center gap-4" dir="rtl">
          <Input
            onChange={(e) => {
              setState((prev) => ({
                ...prev,
                pagination: { ...prev.pagination, pageSize: e.target.value },
              }));
            }}
            type="number"
            value={state.pagination.pageSize}
            color="green"
            size="sm"
            label="عدد البرامج"
            placeholder="عدد البرامج"
          />
          <ButtonGroup variant="outlined" color="green" size="sm" dir="ltr">
            <IconButton onClick={handleRetry}>
              <IoReload />
            </IconButton>
            <IconButton
              onClick={() => handlePageChange(state.pagination.currentPage - 1)}
              disabled={state.pagination.currentPage === 1}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </IconButton>

            <IconButton
              onClick={() => handlePageChange(state.pagination.currentPage + 1)}
              disabled={
                state.pagination.currentPage === state.pagination.totalPages
              }
            >
              <ChevronRightIcon className="w-5 h-5" />
            </IconButton>
          </ButtonGroup>
        </div>
      }
      title="توزيع التبرعات بين البرامج"
      description="التوزيع النسبي للتبرعات بين البرامج المختلفة"
      loading={state.loading}
    >
      {renderContent()}
    </FinancialChart>
  );
}
