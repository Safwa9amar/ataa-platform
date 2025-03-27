import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all partners
export const getAllPartners = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PARTNERS.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch partners");
  }
};

// Get a partner by ID
export const getPartnerById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.PARTNERS.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch partner");
  }
};

// Get partners by User ID
export const getPartnersByUserId = async (userId, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.PARTNERS.GET_BY_USER_ID}/${userId}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch partners by user");
  }
};

// Create a new partner
export const createPartner = async (partnerData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.PARTNERS.CREATE,
      partnerData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create partner");
  }
};

// Update a partner by ID
export const updatePartner = async (id, partnerData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.PARTNERS.UPDATE}/${id}`,
      partnerData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update partner");
  }
};

// Delete a partner by ID
export const deletePartner = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.PARTNERS.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete partner");
  }
};
