import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all donations
export const getAllDonations = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.DONATION.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch donations");
  }
};

// Get a specific donation by ID
export const getDonationById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.DONATION.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch donation");
  }
};

// Create a new donation
export const createDonation = async (donationData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.DONATION.CREATE,
      donationData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create donation");
  }
};

// Update a donation by ID
export const updateDonation = async (id, donationData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.DONATION.UPDATE}/${id}`,
      donationData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update donation");
  }
};

// Delete a donation by ID
export const deleteDonation = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.DONATION.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete donation");
  }
};
