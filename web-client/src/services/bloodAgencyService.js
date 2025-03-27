import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

/**
 * Fetch all Blood Agencies
 * @param {string} userToken
 * @returns {Promise<Object[]>} List of Blood Agencies
 */
export const getAllBloodAgencies = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.BLOOD_AGENCIES.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch Blood Agencies:", error.message);
    throw new Error("Unable to fetch Blood Agencies.");
  }
};

/**
 * Fetch a Blood Agency by ID
 * @param {string} id
 * @param {string} userToken
 * @returns {Promise<Object>} Blood Agency
 */
export const getBloodAgencyById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.BLOOD_AGENCIES.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch Blood Agency with ID ${id}:`, error.message);
    throw new Error("Unable to fetch Blood Agency.");
  }
};

/**
 * Create a new Blood Agency
 * @param {Object} bloodAgencyData
 * @param {string} userToken
 * @returns {Promise<Object>} Created Blood Agency
 */
export const createBloodAgency = async (bloodAgencyData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.BLOOD_AGENCIES.CREATE,
      bloodAgencyData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create Blood Agency:", error.message);
    throw new Error("Unable to create Blood Agency.");
  }
};

/**
 * Update a Blood Agency by ID
 * @param {string} id
 * @param {Object} bloodAgencyData
 * @param {string} userToken
 * @returns {Promise<Object>} Updated Blood Agency
 */
export const updateBloodAgency = async (id, bloodAgencyData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.BLOOD_AGENCIES.UPDATE}/${id}`,
      bloodAgencyData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to update Blood Agency with ID ${id}:`,
      error.message
    );
    throw new Error("Unable to update Blood Agency.");
  }
};

/**
 * Delete a Blood Agency by ID
 * @param {string} id
 * @param {string} userToken
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteBloodAgency = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.BLOOD_AGENCIES.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Failed to delete Blood Agency with ID ${id}:`,
      error.message
    );
    throw new Error("Unable to delete Blood Agency.");
  }
};
