"use client";

import React, { useEffect, useState } from "react";
import DonationHomeCard from "../DonationHomeCard";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import "react-multi-carousel/lib/styles.css";

export default function HomeTabs() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useCredentials();

  const fetchOpportunities = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.DONATION_OPERTUNITIES.GET_FOR_HOME}?role=${user?.role}`
      );
      const result = await response.json();
      setOpportunities(result);
    } catch (error) {
      console.error("Error fetching donation opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  if (loading && opportunities.length === 0) {
    return (
      <div className="h-20 w-full bg-gray-300 text-center animate-pulse rounded-md" />
    );
  }

  if (!loading && opportunities.length === 0) {
    return <div className="text-center my-10 text-gray-600">لا توجد فرص حديثة</div>;
  }

  return (
    <div
      dir="rtl"
      className="w-[90%] grid place-items-center md:grid-cols-4 gap-4"
    >
      {opportunities.map((opportunity, index) => (
        <DonationHomeCard
          key={opportunity.id ?? index}
          id={opportunity.id}
          badgeColor={opportunity?.field?.color}
          badgeTitle={opportunity?.category?.ar_title}
          category={opportunity.category}
          image={`${process.env.NEXT_PUBLIC_API_UPLOADS_URL}/${opportunity?.images?.[0]?.filename}`}
          title={opportunity.title}
          remainingAmount={
            opportunity?.progress?.requiredAmount -
            opportunity?.progress?.totalAmount
          }
        />
      ))}
    </div>
  );
}
