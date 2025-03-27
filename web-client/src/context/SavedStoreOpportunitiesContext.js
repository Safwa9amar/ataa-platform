import React, { createContext, useState, useEffect, useContext } from "react";
import { useCredentials } from "./CredentialsContext";
import { getDonationOpportunityById } from "@/services/donationOpportunityService";

const SavedStoreOpportunitiesContext = createContext();

export const useSavedStoreOpportunities = () =>
  useContext(SavedStoreOpportunitiesContext);

export const SavedStoreOpportunitiesProvider = ({ children }) => {
  const { userToken } = useCredentials();
  const [savedStoreOpportunities, setSavedStoreOpportunities] = useState([]);

  useEffect(() => {
    const loadSavedStoreOpportunities = async () => {
      try {
        const savedOpportunities = localStorage.getItem(
          "savedStoreOpportunities"
        );

        if (savedOpportunities) {
          const parsedOpportunities = JSON.parse(savedOpportunities);
          const opportunitiesWithDetails = await Promise.all(
            parsedOpportunities.map(async (item) =>
              getDonationOpportunityById(item.id, userToken).catch((error) => {
                console.error(
                  `Failed to fetch store opportunity with ID ${item.id}:`,
                  error
                );
                return null; // Return null or a default value for failed promises
              })
            )
          );

          // Filter out null values (failed promises)
          setSavedStoreOpportunities(
            opportunitiesWithDetails.filter(
              (opportunity) => opportunity !== null
            )
          );
        }
      } catch (error) {
        console.error("Failed to load saved store opportunities:", error);
      }
    };

    loadSavedStoreOpportunities();
  }, [userToken]);

  const saveStoreOpportunity = (opportunity) => {
    try {
      const updatedOpportunities = [...savedStoreOpportunities, opportunity];
      setSavedStoreOpportunities(updatedOpportunities);
      localStorage.setItem(
        "savedStoreOpportunities",
        JSON.stringify(updatedOpportunities)
      );
    } catch (error) {
      console.error("Failed to save store opportunity:", error);
    }
  };

  const removeStoreOpportunity = (opportunityId) => {
    try {
      const updatedOpportunities = savedStoreOpportunities.filter(
        (opportunity) => opportunity.id !== opportunityId
      );
      setSavedStoreOpportunities(updatedOpportunities);
      localStorage.setItem(
        "savedStoreOpportunities",
        JSON.stringify(updatedOpportunities)
      );
    } catch (error) {
      console.error("Failed to remove store opportunity:", error);
    }
  };

  const toggleSaveStoreOpportunity = (opportunity) => {
    if (savedStoreOpportunities.find((item) => item.id === opportunity.id)) {
      removeStoreOpportunity(opportunity.id);
    } else {
      saveStoreOpportunity(opportunity);
    }
  };

  const isStoreOpportunitySaved = (opportunityId) =>
    savedStoreOpportunities.some(
      (opportunity) => opportunity.id === opportunityId
    );

  const contextValue = {
    savedStoreOpportunities,
    saveStoreOpportunity,
    removeStoreOpportunity,
    toggleSaveStoreOpportunity,
    isStoreOpportunitySaved,
  };

  return (
    <SavedStoreOpportunitiesContext.Provider value={contextValue}>
      {children}
    </SavedStoreOpportunitiesContext.Provider>
  );
};

export default SavedStoreOpportunitiesContext;
