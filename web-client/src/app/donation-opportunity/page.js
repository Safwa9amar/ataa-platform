"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import Markdown from "react-markdown";
import "react-circular-progressbar/dist/styles.css";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

import UILoading from "@/components/UI/Loading";
import HeaderSection from "./HeaderSection";
import InfoSectionCards from "./InfoSectionCards";
import PaymentOptionsSection from "./PaymentOptionsSection";
import { Gallery } from "@/components/layouts/Gallery";

import { getDonationOpportunityById } from "@/services/donationOpportunityService";
import { useCredentials } from "@/context/CredentialsContext";
import CONSTANTS from "@/config/constants";

export default function Page() {
  const searchParams = useSearchParams();
  const { userToken, user } = useCredentials();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isOrphan = data?.category?.title === "kafalat";

  const DynamicStatisticsGrid = useMemo(
    () =>
      dynamic(() =>
        isOrphan
          ? import("./OrphanStatistics")
          : import("./StatisticsGrid")
      ),
    [isOrphan]
  );

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");
      if (!id) return;

      try {
        setLoading(true);
        const res = await getDonationOpportunityById(id, userToken);
        setData(res);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("فشل في تحميل بيانات الفرصة.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, userToken]);

  if (loading) return <UILoading />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-lg">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        لا توجد بيانات لعرضها
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col items-center gap-10">
      <HeaderSection data={data} />

      <hr className="w-1/3 self-center h-2 bg-mangoBlack rounded-full md:mt-20" />

      <div className="text-md">
        <span>الرقم التعريفي للفرصة: </span>
        <span className="font-bold">#{data?.id}</span>
      </div>

      {/* Statistics Grid for Mobile */}
      <div className="md:hidden w-full px-10 grid grid-cols-2 gap-2">
        <DynamicStatisticsGrid data={data} />
      </div>

      {/* Overview Section */}
      <Markdown className="md:w-5/6 md:text-lg mx-5 md:mx-auto font-ElMessiri whitespace-pre-line">
        {data?.overview || ""}
      </Markdown>

      <InfoSectionCards cards={data?.infoSectionsCards} />

      <Gallery images={data?.images} />
    </div>
  );
}
