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

function Page() {
  const { userToken, user, isLoggedIn } = useCredentials();
  const router = useRouter();
  const searchQuery = useSearchParams();
  const activeTab = searchQuery.get("status") || "all";
  const keywords = searchQuery.get("keywords") || "";
  const [progress, setProgress] = useState([100, 100]);
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
      ) : campaigns.length > 0 ? (
        <div
          dir="rtl"
          className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 "
        >
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              rate={campaign.progress?.rate}
              isAgreed={campaign.isAgreed}
              title={campaign.title}
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
              createdByuserId={campaign.createdByuserId}
              buttonLabel="تبرع الآن"
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
                className="text-md rounded-full font-ElMessiri"
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
