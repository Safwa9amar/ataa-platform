import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "./getCommonHeaders";


// Get all donation opportunities
export const getAllDonationOpportunities = async (
  currentScreen,
  currentTab,
  filterData,
  keywords,
  rate,
  userToken
) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.DONATION_OPERTUNITIES.GET_ALL}/normalOpportunity/${currentScreen}/${currentTab}`,
      { filterData, keywords, rate },
      {
        headers: getCommonHeaders(userToken),
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch donation opportunities");
  }
};
// Get all donation opportunities for store
export const getStoreDonationOpportunities = async (userToken) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.DONATION_OPERTUNITIES.GET_ALL}/storeOpportunity`,
      {},
      {
        headers: getCommonHeaders(userToken),
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch donation opportunities");
  }
};

// Get a specific donation opportunity by ID
export const getDonationOpportunityById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.DONATION_OPERTUNITIES.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch donation opportunity", error.message);
  }
};

// Create a new donation opportunity
export const createDonationOpportunity = async (opportunity, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.DONATION_OPERTUNITIES.CREATE,
      opportunity,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create donation opportunity");
  }
};

// Update a donation opportunity by ID
export const updateDonationOpportunity = async (id, opportunity, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.DONATION_OPERTUNITIES.UPDATE}/${id}`,
      opportunity,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update donation opportunity");
  }
};

// Delete a donation opportunity by ID
export const deleteDonationOpportunity = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.DONATION_OPERTUNITIES.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete donation opportunity");
  }
};

// Get all donation opportunities for home
export const getAllDonationOpportunitiesForHome = async (userToken) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.DONATION_OPERTUNITIES.GET_FOR_HOME,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to fetch donation opportunities for home");
  }
};
