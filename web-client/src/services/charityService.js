import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all charities
export const getAllCharities = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.CHARITIES.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch charities");
  }
};

// Get a charity by ID
export const getCharityById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CHARITIES.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch charity");
  }
};

// Get charities by User ID
export const getCharitiesByUserId = async (userId, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CHARITIES.GET_BY_USER_ID}/${userId}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch charities by user");
  }
};

// Create a new charity
export const createCharity = async (charityData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.CHARITIES.CREATE,
      charityData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create charity");
  }
};

// Update a charity by ID
export const updateCharity = async (id, charityData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.CHARITIES.UPDATE}/${id}`,
      charityData,
      {
        headers: getCommonHeaders(userToken, "multipart/form-data"),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update charity");
  }
};

// Delete a charity by ID
export const deleteCharity = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.CHARITIES.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete charity");
  }
};
