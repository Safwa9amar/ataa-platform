"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCredentials } from "@/context/CredentialsContext";
import { useCampaigns } from "@/context/CampaignContext";
import CampaignCard from "@/components/layouts/CampaignCard";
import { useRouter, useSearchParams } from "next/navigation";
import CONSTANTS from "@/config/constants";
import UILoading from "@/components/UI/Loading";
import NoCampaigns from "@/components/layouts/NoCampaigns";
import { Button } from "@material-tailwind/react";

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
    if (!user?.id) return;
    await fetchCampaigns(
      {
        types: ["GOODS", "MONEY"],
        status: activeTab,
        progress,
        keywords,
        page,
      },
      userToken
    );
  }, [user?.id, userToken, activeTab, progress, keywords, page]);

  // Handle changes in filters
  useEffect(() => {
    resetCampaigns();
    getCampaigns();
  }, [activeTab, keywords]);

  // Cleanup on unmount
  useEffect(() => resetCampaigns, []);

  // Redirect if the user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/account/login");
    }
  }, [isLoggedIn]);

  // Filter campaigns before rendering
  const filteredCampaigns = useMemo(
    () => campaigns.filter((cam) => cam.createdByuserId !== user?.id),
    [campaigns, user?.id]
  );

  if (!isLoggedIn) return null;

  return (
    <div className="p-4" dir="rtl">
      {loading ? (
        <div className="w-full flex justify-center py-10">
          <UILoading />
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              isAgreed={campaign.isAgreed}
              id={campaign.id}
              rate={campaign.progress?.rate}
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
              buttonLabel="تبرع الآن"
            />
          ))}
        </div>
      ) : (
        <NoCampaigns />
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            className="rounded-full"
            onClick={nextPage}
            disabled={loading}
          >
            {loading ? "جاري التحميل..." : "تحميل المزيد"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Page;
