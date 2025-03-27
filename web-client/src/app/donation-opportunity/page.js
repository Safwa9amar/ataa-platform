"use client";
import UILoading from "@/components/UI/Loading";
import Typography from "@/components/UI/Typography";
import { getDonationOpportunityById } from "@/services/donationOpportunityService";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import "react-circular-progressbar/dist/styles.css";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import HeaderSection from "./HeaderSection";
import InfoSectionCards from "./InfoSectionCards";
import PaymentOptionsSection from "./PaymentOptionsSection";
import dynamic from "next/dynamic";
import { useCredentials } from "@/context/CredentialsContext";
import CONSTANTS from "@/config/constants";
import { Alert, Chip } from "@material-tailwind/react";
import { Gallery } from "@/components/layouts/Gallery";
import Markdown from "react-markdown";
// import plugins if you need

export default function Page() {
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const { userToken, user } = useCredentials();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let isOrphan = data?.category?.title === "kafalat";
  const DynamiqueStatisticsGrid = useMemo(() => {
    if (isOrphan) {
      return dynamic(() => import("./OrphanStatistics"));
    }
    return dynamic(() => import("./StatisticsGrid"));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const id = searchParams.get("id");

      if (!id) return;

      setLoading(true);
      try {
        const res = await getDonationOpportunityById(id, userToken);
        setData(res);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load donation opportunity.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

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
        <span>الرقم التعريفي للفرصة : </span>
        <span className="font-bold">#{data?.id}</span>
      </div>
      <div className="md:hidden w-full px-10 grid grid-cols-2 gap-2">
        <DynamiqueStatisticsGrid data={data} />
      </div>
      <Markdown className="md:w-5/6 md:text-lg mx-5 md:mx-auto font-ElMessiri ">
        {`${data?.overview}`}
      </Markdown>
      <InfoSectionCards cards={data?.infoSectionsCards} />
      <Gallery images={data?.images} />
      {/* {user.role === CONSTANTS.USERS_ROLES.donor &&
        data?.progress?.rate !== 100 && <PaymentOptionsSection data={data} />} */}
    </div>
  );
}
