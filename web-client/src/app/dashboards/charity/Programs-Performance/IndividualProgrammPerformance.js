"use client";
import FinancialChart from "@/components/dashboards/FinancialChart";
import { useCredentials } from "@/context/CredentialsContext";
import { getMyDonationOpportunities } from "@/services/donationOpportunityService";
import { IconButton, Option, Select, Spinner } from "@material-tailwind/react";
import React, { useCallback, useEffect, useState } from "react";
import { IoReload } from "react-icons/io5";
import { getCommonHeaders } from "@/services/getCommonHeaders";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { DataFetchError } from "@/components/layouts/DataFetchError";
import { FinancialKpiCard } from "@/components/dashboards/FinancialKpiCard";
import ProgramSelector from "./ProgramSelector";

export default function IndividualProgramPerformance() {
  const { userToken } = useCredentials();
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedProgramTitle, setSelectedProgramTitle] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartsData, setChartsData] = useState({
    donorGrowthRateByDay: [],
    beneficiariesByDays: [],
    averageDonationAmount: 0,
    totalDonations: 0,
  });
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Fetch all programs
  const getAllPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyDonationOpportunities({
        status: "active",
        keywords: "",
        userToken,
      });
      if (data && data.length > 0) {
        setPrograms(data);
        setSelectedProgram(data[0].id); // Set the first program as default
        setSelectedProgramTitle(data[0].title); // Set the first program title
      } else {
        setError("لا توجد برامج نشطة أو متاحة  حاليا ");
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
      setError("فشل تحميل قائمة البرامج.");
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Fetch monthly performance data for the selected program
  const fetchMonthlyPerformance = useCallback(async () => {
    if (!selectedProgram) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_ENDPOINTS.DASHBOARDS.programsPerformance}/monthly-program-performance/${selectedProgram}`,
        {
          headers: getCommonHeaders(userToken),
          params: {
            year: selectedYear,
            month: selectedMonth,
          },
        }
      );

      if (!res.data || res.data.length === 0) {
        throw new Error("لا توجد بيانات متاحة.");
      }

      setChartsData({
        donorGrowthRateByDay: res.data.donorGrowthRateByDay,
        beneficiariesByDays: res.data.dailyData,
        averageDonationAmount: res.data.averageDonationAmount,
        totalDonations: res.data.totalDonations,
      });
      setError("");
    } catch (err) {
      console.error("API Error:", err);
      setError("فشل تحميل بيانات أداء البرامج الشهري.");
      setChartsData({
        donorGrowthRateByDay: [],
        beneficiariesByDays: [],
        averageDonationAmount: 0,
        totalDonations: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [selectedProgram, userToken, selectedYear, selectedMonth]);

  // Fetch programs on component mount
  useEffect(() => {
    getAllPrograms();
  }, [getAllPrograms]);

  // Fetch monthly performance data when selected program, year, or month changes
  useEffect(() => {
    if (selectedProgram) {
      fetchMonthlyPerformance();
    }
  }, [selectedProgram, selectedYear, selectedMonth, fetchMonthlyPerformance]);

  if (error) {
    return <DataFetchError error={error} onRetry={getAllPrograms} />;
  }

  return (
    <div className="bg-mangoBlack rounded-xl p-10 shadow-lg">
      <div className="space-y-5" dir="rtl">
        <h1>الأداء الشهري لبرنامج {selectedProgramTitle}</h1>
        <div className="flex gap-4">
          <Select
            label="السنة"
            value={selectedYear}
            onChange={(value) => setSelectedYear(Number(value))}
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          <Select
            label="الشهر"
            value={selectedMonth}
            onChange={(value) => setSelectedMonth(Number(value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <Option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString("ar", { month: "long" })}
              </Option>
            ))}
          </Select>
          <ProgramSelector
            programs={programs}
            loading={loading}
            selectedProgram={selectedProgram}
            setSelectedProgram={setSelectedProgram}
            getAllPrograms={getAllPrograms}
            setSelectedProgramTitle={setSelectedProgramTitle}
          />
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-evenly m-10"
        dir="rtl"
      >
        <FinancialKpiCard
          title={"إجمالي التبرعات"}
          value={chartsData.totalDonations}
          description={""}
          currency="دج"
        />
        <FinancialKpiCard
          title={"متوسط حجم التبرعات"}
          value={chartsData.averageDonationAmount}
          description={""}
          currency="دج"
        />
      </div>
      {/* Chart for Donor Growth Rate */}
      <FinancialChart title={"معدل نمو المتبرعين"}>
        <LineChart data={chartsData.donorGrowthRateByDay}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis
            tickFormatter={(value) => {
              return `${value}%`;
            }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="growthRate"
            stroke="#8884d8"
            name="معدل النمو"
          />
        </LineChart>
      </FinancialChart>

      {/* Chart for Beneficiaries */}
      <FinancialChart title={"عدد المستفيدين"}>
        <LineChart data={chartsData.beneficiariesByDays}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="beneficiaries"
            stroke="#82ca9d"
            name="عدد المستفيدين"
          />
        </LineChart>
      </FinancialChart>
    </div>
  );
}
