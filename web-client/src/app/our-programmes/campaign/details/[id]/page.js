"use client";
import UILoading from "@/components/UI/Loading";
import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import HeaderSection from "./HeaderSection";
import InfoSectionCards from "./InfoSectionCards";
import PaymentOptionsSection from "./PaymentOptionsSection";
import { getCampaignById } from "@/services/campaignServices";
import { useCredentials } from "@/context/CredentialsContext";
import Markdown from "react-markdown";
import StatisticsGrid from "./StatisticsGrid";
import { Chip, Typography } from "@material-tailwind/react";
import { Gallery } from "@/components/layouts/Gallery";

// import plugins if you need

export default function Page({ params }) {
  const { userToken, user } = useCredentials();
  const id = params.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const res = await getCampaignById(id, userToken);
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("فشل  في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <UILoading />;
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex flex-col justify-center items-center gap-10">
      <HeaderSection data={data} />
      <hr className="w-1/3 self-center h-2 bg-mangoBlack rounded-full md:mt-20" />
      <div>
        <span>الرقم التعريفي للحمة : </span>
        <span>#{data?.id}</span>
      </div>
      <div className="md:hidden w-full px-10 grid grid-cols-2 gap-2">
        <StatisticsGrid data={data} />
      </div>
      <Markdown className="md:w-1/2 px-5 md:text-lg font-ElMessiri ">
        {`${data?.description}`}
      </Markdown>

      <InfoSectionCards cards={data?.infoSectionsCards} />
      {/*    {data?.progress?.rate !== 100 && !(data.createdByuserId === user.id) && (
        <PaymentOptionsSection data={data} />
      )} */}

      <Gallery images={data?.images} />
    </div>
  );
}
