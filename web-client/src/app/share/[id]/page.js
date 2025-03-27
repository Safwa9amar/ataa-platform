"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";
import UILoading from "@/components/UI/Loading";

export default function SharePage({ params }) {
  const router = useRouter();
  const { id } = params; // Get share ID from URL

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.BASE_URL}/share/${id}`
        );

        // Log response in development only
        if (process.env.NODE_ENV === "development") {
          console.log("Share Data:", response.data);
        }

        const { uniqueLink, campaign, donationOpportunity } = response.data;

        // Construct source query param
        const sourceQuery = `source=${encodeURIComponent(uniqueLink)}`;

        // Redirect based on link type
        if (campaign) {
          switch (campaign.CampaignType) {
            case "BLOOD":
              router.replace(
                `/our-programmes/campaign/user-blood?id=${
                  campaign.id
                }&title=${encodeURIComponent(campaign.title)}&${sourceQuery}`
              );
              break;
            case "MONEY":
            case "GOODS":
              router.replace(
                `/our-programmes/campaign/details/${campaign.id}?${sourceQuery}`
              );
              break;
            default:
              router.replace("/404"); // Handle unknown campaign types
          }
        } else if (donationOpportunity) {
          router.replace(
            `/donation-opportunity?id=${donationOpportunity.id}&${sourceQuery}`
          );
        } else {
          router.replace("/404"); // Handle invalid share ID
        }
      } catch (error) {
        console.error("Error fetching share data:", error);
        router.replace("/404"); // Redirect on failure
      }
    };

    fetchData();
  }, [id, router]);

  return (
    <div className="min-h-[50vh]">
      <UILoading />
    </div>
  );
}
