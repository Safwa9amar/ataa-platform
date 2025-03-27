import React, { createContext, useState, useEffect, useContext } from "react";
import { getDonationOpportunityById } from "../services/donationOpportunityService";
import { useCredentials } from "./CredentialsContext";

const SavedDonationOpportunitiesContext = createContext();

export const useSavedDonationOpportunities = () =>
  useContext(SavedDonationOpportunitiesContext);

export const SavedDonationOpportunitiesProvider = ({ children }) => {
  const { userToken } = useCredentials();
  const [savedOpportunities, setSavedOpportunities] = useState([]);

  useEffect(() => {
    const loadSavedOpportunities = async () => {
      try {
        const savedOpportunities = localStorage.getItem("savedOpportunities");

        if (savedOpportunities) {
          const parsedOpportunities = JSON.parse(savedOpportunities);
          const opportunitiesWithDetails = await Promise.all(
            parsedOpportunities.map(async (item) =>
              getDonationOpportunityById(item.id, userToken).catch((error) => {
                console.error(
                  `Failed to fetch opportunity with ID ${item.id}:`,
                  error
                );
                return null; // Return null or a default value for failed promises
              })
            )
          );

          // Filter out null values (failed promises)
          setSavedOpportunities(
            opportunitiesWithDetails.filter(
              (opportunity) => opportunity !== null
            )
          );
        }
      } catch (error) {
        console.error("Failed to load saved donation opportunities:", error);
      }
    };

    loadSavedOpportunities();
  }, [userToken]);

  const saveOpportunity = (opportunity) => {
    try {
      const updatedOpportunities = [...savedOpportunities, opportunity];
      setSavedOpportunities(updatedOpportunities);
      localStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updatedOpportunities)
      );
    } catch (error) {
      console.error("Failed to save donation opportunity:", error);
    }
  };

  const removeOpportunity = (opportunityId) => {
    try {
      const updatedOpportunities = savedOpportunities.filter(
        (opportunity) => opportunity.id !== opportunityId
      );
      setSavedOpportunities(updatedOpportunities);
      localStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updatedOpportunities)
      );
    } catch (error) {
      console.error("Failed to remove donation opportunity:", error);
    }
  };

  const toggleSaveOpportunity = (opportunity) => {
    if (savedOpportunities.find((item) => item.id === opportunity.id)) {
      removeOpportunity(opportunity.id);
    } else {
      saveOpportunity(opportunity);
    }
  };

  const isOpportunitySaved = (opportunityId) =>
    savedOpportunities.some((opportunity) => opportunity.id === opportunityId);

  const contextValue = {
    savedOpportunities,
    saveOpportunity,
    removeOpportunity,
    toggleSaveOpportunity,
    isOpportunitySaved,
  };

  return (
    <SavedDonationOpportunitiesContext.Provider value={contextValue}>
      {children}
    </SavedDonationOpportunitiesContext.Provider>
  );
};

export default SavedDonationOpportunitiesContext;
