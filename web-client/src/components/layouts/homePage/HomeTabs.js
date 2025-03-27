"use client";
import React from "react";
import DonationHomeCard from "../DonationHomeCard";
import API_ENDPOINTS from "@/config/apiEndPoints";
import "react-multi-carousel/lib/styles.css";
import { useCredentials } from "@/context/CredentialsContext";

export default function HomeTabs() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useCredentials();

  const getData = async () => {
    try {
      let response = await fetch(
        `${API_ENDPOINTS.DONATION_OPERTUNITIES.GET_FOR_HOME}?role=${user?.role}`
      );
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  if (loading && data.length === 0) {
    return (
      <div className="h-20 w-full bg-gray-300 text-center animate-pulse"></div>
    );
  }
  return data.length === 0 ? (
    <div className="text-center my-10">لا توجد فرص حديثة</div>
  ) : (
    <div
      dir="rtl"
      className="w-[90%]  grid place-items-center md:grid-cols-4  gap-4"
    >
      {data?.map((d, index) => (
        <DonationHomeCard
          key={index}
          id={d.id}
          badgeColor={d.field.color}
          badgeTitle={d.category.ar_title}
          category={d.category}
          image={
            process.env.NEXT_PUBLIC_API_UPLOADS_URL + "/" + d.images[0].filename
          }
          title={d.title}
          remainingAmount={d.progress?.requiredAmount - d.progress?.totalAmount}
        />
      ))}
    </div>
  );
}
