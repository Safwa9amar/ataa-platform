"use client";
import UILoading from "@/components/UI/Loading";
import Typography from "@/components/UI/Typography";
import { getDonationOpportunityById } from "@/services/donationOpportunityService";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import "react-circular-progressbar/dist/styles.css";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import HeaderSection from "./HeaderSection";
import InfoSectionCards from "./InfoSectionCards";
import PaymentOptionsSection from "./PaymentOptionsSection";
import { useCredentials } from "@/context/CredentialsContext";
import CONSTANTS from "@/config/constants";
import { Gallery } from "@/components/layouts/Gallery";
import Markdown from "react-markdown";

// import plugins if you need

export default function Page({ params }) {
  const id = params.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userToken, user } = useCredentials();

  useEffect(() => {
    const fetchData = async () => {
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
      <hr className="my-2 w-1/3 self-center h-2 bg-mangoBlack rounded-full md:mt-20" />
      <div>
        <span>الرقم التعريفي للفرصة : </span>
        <span className="font-bold">#{data?.id}</span>
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
