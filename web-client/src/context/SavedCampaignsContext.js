import React, { createContext, useState, useEffect, useContext } from "react";
import { useCredentials } from "./CredentialsContext";
import { getCampaignById } from "@/services/campaignServices";

const SavedCampaignsContext = createContext();

export const useSavedCampaigns = () => useContext(SavedCampaignsContext);

export const SavedCampaignsProvider = ({ children }) => {
  const { userToken } = useCredentials();
  const [savedCampaigns, setSavedCampaigns] = useState([]);

  useEffect(() => {
    const loadSavedCampaigns = async () => {
      try {
        const savedCampaigns = localStorage.getItem("savedCampaigns");

        if (savedCampaigns) {
          const parsedCampaigns = JSON.parse(savedCampaigns);
          const campaignsWithDetails = await Promise.all(
            parsedCampaigns.map(async (item) =>
              getCampaignById(item.id, userToken).catch((error) => {
                console.error(
                  `Failed to fetch campaign with ID ${item.id}:`,
                  error
                );
                return null; // Return null or a default value for failed promises
              })
            )
          );

          // Filter out null values (failed promises)
          setSavedCampaigns(
            campaignsWithDetails.filter((campaign) => campaign !== null)
          );
        }
      } catch (error) {
        console.error("Failed to load saved campaigns:", error);
      }
    };

    loadSavedCampaigns();
  }, [userToken]);

  const saveCampaign = (campaign) => {
    try {
      const updatedCampaigns = [...savedCampaigns, campaign];
      setSavedCampaigns(updatedCampaigns);
      localStorage.setItem("savedCampaigns", JSON.stringify(updatedCampaigns));
    } catch (error) {
      console.error("Failed to save campaign:", error);
    }
  };

  const removeCampaign = (campaignId) => {
    try {
      const updatedCampaigns = savedCampaigns.filter(
        (campaign) => campaign.id !== campaignId
      );
      setSavedCampaigns(updatedCampaigns);
      localStorage.setItem("savedCampaigns", JSON.stringify(updatedCampaigns));
    } catch (error) {
      console.error("Failed to remove campaign:", error);
    }
  };

  const toggleSaveCampaign = (campaign) => {
    if (savedCampaigns.find((item) => item.id === campaign.id)) {
      removeCampaign(campaign.id);
    } else {
      saveCampaign(campaign);
    }
  };

  const isCampaignSaved = (campaignId) =>
    savedCampaigns.some((campaign) => campaign.id === campaignId);

  const contextValue = {
    savedCampaigns,
    saveCampaign,
    removeCampaign,
    toggleSaveCampaign,
    isCampaignSaved,
  };

  return (
    <SavedCampaignsContext.Provider value={contextValue}>
      {children}
    </SavedCampaignsContext.Provider>
  );
};

export default SavedCampaignsContext;
