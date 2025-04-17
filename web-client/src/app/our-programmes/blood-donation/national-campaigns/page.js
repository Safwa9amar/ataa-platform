"use client";

import NationalBloodDonationCard from "@/components/layouts/NationalBloodDonationCard";
import UILoading from "@/components/UI/Loading";
import WilayaSelect from "@/components/UI/WilayaSelect";
import CONSTANTS from "@/config/constants";
import { useAlgeriaCitiesContext } from "@/context/AlgeriaCitiesContext";
import { getAllNationalBloodCampaigns } from "@/services/nationalBloodCapmaigns";
import { getCampaignByQuery } from "@/services/NationalCampaignService";
import { Button, IconButton } from "@material-tailwind/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdFilterAltOff } from "react-icons/md";
import validator from "validator";
import {motion} from "framer-motion";
export default function Page() {
  const { getWilayaByCode } = useAlgeriaCitiesContext();
  const [selectedWilaya, setSelectedWilaya] = useState(""); // Empty string for all campaigns
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const keywords = searchParams.get("keywords") || "";

  const fetchCampaigns = async (wilaya = "") => {
    setLoading(true); // Start loading
    try {
      const query = wilaya ? { willayaCode: wilaya } : {}; // Conditional query object
      const data = await getAllNationalBloodCampaigns(query); // Use service method to fetch campaigns
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]); // Reset campaigns on error
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleWilayaChange = (wilaya) => {
    setSelectedWilaya(wilaya); // Update selected Wilaya
    fetchCampaigns(wilaya); // Fetch campaigns for the selected Wilaya
  };
  useEffect(() => {
    if (!validator.isEmpty(keywords)) {
      let newCampaigns = campaigns.filter((campaign) =>
        campaign.campaignName.toLowerCase().includes(keywords.toLowerCase())
      );
      setCampaigns(newCampaigns);
    } else {
      fetchCampaigns(selectedWilaya); // Reset campaigns if keywords are empty
    }
  }, [keywords]);

  useEffect(() => {
    // Fetch all campaigns on initial load
    fetchCampaigns();
  }, []);

  return (
    <div dir="rtl" className="p-4">
      {/* Wilaya selection component */}
      <div className="flex items-center justify-between gap-5">
        <WilayaSelect
          onWilayaChange={handleWilayaChange}
          selectedWilaya={selectedWilaya}
        />
        <Button
          variant="gradient"
          size="sm"
          color="red"
          className="flex items-center gap-2 scale-95 hover:scale-100 font-ElMessiri "
          onClick={() => handleWilayaChange("")}
        >
          <MdFilterAltOff size={25} />
          <span>عرض الكل</span>
        </Button>
      </div>
      {/* Loading indicator */}
      {loading && <UILoading />}

      {/* Donation campaigns grid */}
      {!loading && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {campaigns.map((campaign) => (
            <NationalBloodDonationCard
              id={campaign.id}
              city={getWilayaByCode(campaign.wilaya)?.wilaya_name || ""}
              key={campaign.id}
              title={campaign.title}
              badgeTitle={campaign.campaignName}
              badgeColor="#E63946"
              image="/images/imageCART.png"
              remainingAmount={`الوحدات المطلوبة: ${campaign.targetUnits}`}
              needyGroup={`الزمرة الأكثر احتياجا: ${
                CONSTANTS.BLOOD_TYPES[campaign.mostNeededBlood]
              }`}
            />
          ))}
        </div>
      ) : (
        !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <h1 className="text-2xl font-bold mb-4">لا توجد حملات حاليا</h1>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
