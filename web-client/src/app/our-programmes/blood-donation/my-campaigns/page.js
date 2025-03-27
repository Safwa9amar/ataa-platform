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

  // Fetch campaigns based on the active filters
  const getCampaigns = useCallback(async () => {
    await fetchCampaignsByUserId(
      user.id,
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
  let newCampaigns = campaigns.filter((cam) => cam.isAgreed === isAgreed);

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
      ) : campaigns.length > 0 ? (
        <div
          dir="rtl"
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
        >
          {newCampaigns.map((campaign) => (
            <BloodDonationCard
              bloodType={campaign.selectedBloodType}
              key={campaign.id}
              id={campaign.id}
              isAgreed={campaign.isAgreed}
              rate={campaign.progress.rate}
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
              createdByuserId={campaign.createdByuserId}
              rejectedWhy={campaign.rejectedWhy}
              rejected={campaign.rejected}
              rejectedBy={campaign.rejectedBy}
            />
          ))}
        </div>
      ) : (
        <NoData
          action={
            <Link href={"#"}>
              <Button
                variant="gradient"
                color="green"
                size="sm"
                className="text-sm rounded-full font-ElMessiri"
              >
                انشاء حملتي
              </Button>
            </Link>
          }
          title="لم تقم بإنشاء حملة كن أول من يبادر"
        />
      )}
    </div>
  );
}

export default Page;
