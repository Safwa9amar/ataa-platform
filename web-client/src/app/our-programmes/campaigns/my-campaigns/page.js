"use client";
import { useState, useEffect, useCallback } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { useCampaigns } from "@/context/CampaignContext";
import { useRouter, useSearchParams } from "next/navigation";
import CONSTANTS from "@/config/constants";
import UILoading from "@/components/UI/Loading";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import NoData from "@/components/layouts/NoData";
import BloodDonationCard from "@/components/layouts/BloodDonationCard";
import CampaignCard from "@/components/layouts/CampaignCard";
import NoCampaigns from "@/components/layouts/NoCampaigns";

function Page() {
  const { userToken, user, isLoggedIn } = useCredentials();
  const router = useRouter();
  const searchQuery = useSearchParams();
  const activeTab = searchQuery.get("status") || "all";
  const keywords = searchQuery.get("keywords") || "";
  const [progress, setProgress] = useState([0, 99]);
  const isAgreed = searchQuery.get("isAgreed") === "true" ? true : false;

  const {
    campaigns,
    error,
    loading,
    fetchCampaignsByUserId,
    nextPage,
    page,
    hasMore,
    resetCampaigns,
  } = useCampaigns();
  let newCampaigns = campaigns.filter((cam) => cam.isAgreed === isAgreed);
  // Fetch campaigns based on the active filters
  const getCampaigns = useCallback(async () => {
    await fetchCampaignsByUserId(
      user.id,
      {
        types: ["GOODS", "MONEY"],
        status: activeTab,
        progress,
        keywords,
        page,
      },
      userToken
    );
  }, [user.id, userToken, activeTab, progress, keywords, page]);

  useEffect(() => {
    resetCampaigns();
    getCampaigns();
  }, [activeTab, keywords, isAgreed]);

  useEffect(() => {
    return resetCampaigns;
  }, []);

  if (!isLoggedIn) {
    router.push("/account/login");
  }

  return (
    <div className="p-4 ">
      {/* Campaign Cards */}
      {loading ? (
        <div className="w-screen flex justify-center">
          <UILoading />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : newCampaigns.length > 0 ? (
        <div
          dir="rtl"
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
        >
          {newCampaigns
            .filter((cam) => cam.isAgreed === isAgreed)
            .map((campaign) => (
              <CampaignCard
                key={campaign.id}
                id={campaign.id}
                rate={campaign.progress?.rate}
                title={campaign.title}
                isAgreed={campaign.isAgreed}
                subtitle={campaign.subtitle}
                urgency={CONSTANTS.CAMPAIGNSTATUS[campaign.campaignStatus]}
                amountCollected={campaign.progress?.totalAmount}
                description={campaign.description}
                mainImage={
                  process.env.NEXT_PUBLIC_API_URL +
                  "/uploads/" +
                  campaign.images[0]?.filename
                }
                iconImage={campaign.iconImage}
                buttonLabel="تبرع الآن"
                createdByuserId={campaign.createdByuserId}
                rejectedWhy={campaign.rejectedWhy}
                rejected={campaign.rejected}
                rejectedBy={campaign.rejectedBy}
              />
            ))}
        </div>
      ) : (
        <NoCampaigns
          message="لا توجد حملات معلقة حاليا"
          action={
            <Link
              className="bg-teal-400 text-teal-900 rounded-full py-2 px-4 text-sm"
              href={"/our-programmes/campaigns/create"}
            >
              انشاء حملتي
            </Link>
          }
        />
      )}
    </div>
  );
}

export default Page;
