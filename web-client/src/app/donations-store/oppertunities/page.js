"use client";
import StoreDonationCard from "@/components/layouts/StoreDonationCard";
import API_ENDPOINTS from "@/config/apiEndPoints";
import { useCredentials } from "@/context/CredentialsContext";
import { getStoreDonationOpportunities } from "@/services/donationOpportunityService";
import React, { useEffect, useState } from "react";

const StoreDonationOpportunities = () => {
  const [data, setData] = useState([]);
  const { userToken } = useCredentials();
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const result = await getStoreDonationOpportunities(userToken);
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-4 mt-20" dir="rtl">
      {/* Header Button */}

      {/* Content */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {loading ? (
          <>
            <StoreDonationCard isLoading />
            <StoreDonationCard isLoading />
          </>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center">
            <img
              src="/images/nodata.png"
              alt="No data"
              className="w-80 h-auto"
            />
            <p className="text-2xl">لا توجد فرص لعرضها</p>
          </div>
        ) : (
          data.map((item) => (
            <StoreDonationCard
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              image={API_ENDPOINTS.UPLOADS + "/" + item.images[0].filename}
              badgeTitle={item.field.ar_title}
              badgeColor={item.field.color}
              remainingAmount={
                item.progress.requiredAmount - item.progress.totalAmount
              }
              progress={item.progress}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StoreDonationOpportunities;
