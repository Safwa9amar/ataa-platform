import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

export const saveStateToLocalStorage = (state) => {
  try {
    localStorage.setItem("campaignData", JSON.stringify(state));
    if (state.token) {
      localStorage.setItem("authToken", state.token);
    } else {
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.error("Failed to save campaign data", error);
  }
};

const getAllCampaigns = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.CAMPAIGN.GET_CAMPAIGNS, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all campaigns:", error);
    throw error;
  }
};

const createCampaign = async (campaignData, userToken) => {
  delete campaignData.message;
  delete campaignData.isAgreed;

  // Adjust campaign data based on type
  if (campaignData.campaignStatus === "ONGOING") {
    delete campaignData.proofFiles;
  }

  if (campaignData.CampaignType === "BLOOD") {
    delete campaignData.bankAccount;
    delete campaignData.ownerAddress;
    delete campaignData.ownerEmail;
    delete campaignData.ownerPhone;
    delete campaignData.ownerID;
    delete campaignData.ownerName;
  } else if (
    campaignData.CampaignType === "MONEY" ||
    campaignData.CampaignType === "GOODS"
  ) {
    delete campaignData.bloodBankName;
    delete campaignData.selectedBloodType;
    delete campaignData.googleMapLink;
  }

  const response = await axios.post(
    API_ENDPOINTS.CAMPAIGN.CREATE_CAMPAIGN,
    campaignData,
    { headers: getCommonHeaders(userToken) }
  );
  return response.data;
};

const getCampaignById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CAMPAIGN.GET_CAMPAIGN_BY_ID}${id}`,
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign with ID ${id}:`, error);
    throw error;
  }
};

const getCampaignsByUserId = async (userID, filters, userToken) => {
  try {
    const params = new URLSearchParams({ ...filters });
    const response = await axios.get(
      `${API_ENDPOINTS.CAMPAIGN.GET_CAMPAIGNS_BY_USER_ID}/${userID}?${params}`,
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaigns for user ID ${userID}:`, error);
    throw error;
  }
};

const getUsersCampaigns = async (filters, userToken) => {
  try {
    const params = new URLSearchParams({ ...filters });
    const response = await axios.get(
      `${API_ENDPOINTS.CAMPAIGN.GET_USERS_CAMPAIGNS}?${params}`,
      { headers: getCommonHeaders(userToken) }
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching users campaigns `, error);
    throw error;
  }
};

const updateCampaign = async (id, campaignData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.CAMPAIGN.GET_CAMPAIGN_BY_ID}${id}`,
      campaignData,
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating campaign with ID ${id}:`, error);
    throw error;
  }
};

const deleteCampaign = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.CAMPAIGN.GET_CAMPAIGN_BY_ID}${id}`,
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting campaign with ID ${id}:`, error);
    throw error;
  }
};

export {
  getAllCampaigns,
  createCampaign,
  getCampaignById,
  getCampaignsByUserId,
  getUsersCampaigns,
  updateCampaign,
  deleteCampaign,
};
