import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all Zakat records
export const getAllZakat = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.ZAKAT.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch Zakat records");
  }
};

// Get Zakat by ID
export const getZakatById = async (id, userToken) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.ZAKAT.GET_BY_ID}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch Zakat record");
  }
};

// Get Zakat by user ID
export const getZakatByUserId = async (userId, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.ZAKAT.GET_BY_USER_ID}/${userId}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch Zakat records by user");
  }
};

// Create a new Zakat record
export const createZakat = async (zakatData, userToken) => {
  try {
    const response = await axios.post(API_ENDPOINTS.ZAKAT.CREATE, zakatData, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create Zakat record");
  }
};

// Update Zakat record by ID
export const updateZakat = async (id, zakatData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.ZAKAT.UPDATE}/${id}`,
      zakatData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update Zakat record");
  }
};

// Delete Zakat record by ID
export const deleteZakat = async (id, userToken) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.ZAKAT.DELETE}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete Zakat record");
  }
};
