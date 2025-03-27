import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all campaigns
export const getAllCampaigns = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.NATIONAL_BLOOD.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch campaigns");
  }
};

// Get a campaign by ID
export const getCampaignById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.NATIONAL_BLOOD.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch campaign");
  }
};

// Get campaigns by query
export const getCampaignByQuery = async (queryParams, userToken) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.NATIONAL_BLOOD.GET_BY_QUERY,
      {
        headers: getCommonHeaders(userToken),
        params: queryParams, // Attach query parameters
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch campaigns by query");
  }
};

// Create a new campaign
export const createCampaign = async (campaignData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.NATIONAL_BLOOD.CREATE,
      campaignData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create campaign");
  }
};

// Update a campaign by ID
export const updateCampaign = async (id, campaignData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.NATIONAL_BLOOD.UPDATE}/${id}`,
      campaignData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update campaign");
  }
};

// Delete a campaign by ID
export const deleteCampaign = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.NATIONAL_BLOOD.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete campaign");
  }
};
