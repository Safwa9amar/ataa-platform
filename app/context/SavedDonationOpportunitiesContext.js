import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDonationOpportunityById } from "../services/donationOpportunityService";

const SavedDonationOpportunitiesContext = createContext();

export const useSavedDonationOpportunities = () =>
  useContext(SavedDonationOpportunitiesContext);

export const SavedDonationOpportunitiesProvider = ({ children }) => {
  const [savedOpportunities, setSavedOpportunities] = useState([]);

  useEffect(() => {
    const loadSavedOpportunities = async () => {
      try {
        const savedOpportunities = await AsyncStorage.getItem(
          "savedOpportunities"
        );

        if (savedOpportunities) {
          const parsedOpportunities = JSON.parse(savedOpportunities);
          const opportunitiesWithDetails = await Promise.all(
            parsedOpportunities.map(async (item) => {
              return await getDonationOpportunityById(item.id);
            })
          );
          setSavedOpportunities(opportunitiesWithDetails);
        }
      } catch (error) {
        console.error("Failed to load saved donation opportunities:", error);
      }
    };

    loadSavedOpportunities();
  }, []);

  const saveOpportunity = async (opportunity) => {
    try {
      const updatedOpportunities = [...savedOpportunities, opportunity];
      setSavedOpportunities(updatedOpportunities);
      await AsyncStorage.setItem(
        "savedOpportunities",
        JSON.stringify(updatedOpportunities)
      );
    } catch (error) {
      console.error("Failed to save donation opportunity:", error);
    }
  };

  const removeOpportunity = async (opportunityId) => {
    try {
      const updatedOpportunities = savedOpportunities.filter(
        (opportunity) => opportunity.id !== opportunityId
      );
      setSavedOpportunities(updatedOpportunities);
      await AsyncStorage.setItem(
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
