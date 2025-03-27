"use client";

import { useState, useEffect, useCallback } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { useCampaigns } from "@/context/CampaignContext";
import CampaignCard from "@/components/layouts/CampaignCard";
import { useRouter, useSearchParams } from "next/navigation";
import CONSTANTS from "@/config/constants";
import UILoading from "@/components/UI/Loading";
import Navigation from "../Navigation";
import BloodDonationCard from "@/components/layouts/BloodDonationCard";
import NoData from "@/components/layouts/NoData";

const campaignTypes = [
  { status: "all", ar_status: "الكل", color: "black" },
  { status: "URGENT", ar_status: "مستعجلة", color: "red" },
  { status: "NOT_URGENT", ar_status: "غير مستعجلة", color: "green" },
  { status: "ONGOING", ar_status: "صدقة جارية", color: "blue" },
];

function Page() {
  const { userToken, user, isLoggedIn } = useCredentials();
  const router = useRouter();
  const searchQuery = useSearchParams();
  const activeTab = searchQuery.get("status") || "all";
  const keywords = searchQuery.get("keywords") || "";
  const [progress, setProgress] = useState([0, 99]);

  const {
    campaigns,
    error,
    loading,
    fetchUsersCampaigns: fetchCampaigns,
    nextPage,
    page,
    hasMore,
    resetCampaigns,
  } = useCampaigns();

  // Fetch campaigns based on the active filters
  const getCampaigns = useCallback(async () => {
    await fetchCampaigns(
      {
        types: ["BLOOD"],
        status: activeTab,
        progress,
        keywords,
        page,
      },
      userToken
    );
  }, [user.id, userToken, activeTab, progress, keywords, page]);

  // Handle changes in filters
  useEffect(() => {
    resetCampaigns(); // Reset campaigns when filters change
    getCampaigns();
  }, [activeTab, keywords]);

  // Cleanup on unmount
  useEffect(() => {
    return resetCampaigns;
  }, []);

  // Redirect if the user is not logged in
  if (!isLoggedIn) {
    router.push("/account/login");
    return null; // Prevent rendering while redirecting
  }

  return (
    <div className="p-4">
      {/* Campaign Cards */}

      {loading ? (
        <div className="w-screen flex justify-center">
          <UILoading />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : campaigns.length > 0 ? (
        <div
          dir="rtl"
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {campaigns
            .filter((cam) => cam.createdByuserId !== user.id)
            .map((campaign) => (
              <BloodDonationCard
                bloodType={campaign.selectedBloodType}
                key={campaign.id}
                id={campaign.id}
                isAgreed={campaign.isAgreed}
                rate={campaign.progress.rate}
                rejected={campaign.rejected}
                title={campaign.title}
                numberOfUnits={campaign.numberOfUnits}
                donatedUnits={campaign.donatedUnits}
                subtitle={campaign.subtitle}
                urgency={CONSTANTS.CAMPAIGNSTATUS[campaign.campaignStatus]}
                amountCollected={campaign.progress.totalAmount}
                description={campaign?.description}
                mainImage={
                  process.env.NEXT_PUBLIC_API_URL +
                  "/uploads/" +
                  campaign?.images[0]?.filename
                }
                iconImage={campaign.iconImage}
                buttonLabel="ساهم بإنقاذ حياة"
              />
            ))}
        </div>
      ) : (
        <NoData title="لا توجد حملات نشطة حاليا" />
      )}
    </div>
  );
}

export default Page;
