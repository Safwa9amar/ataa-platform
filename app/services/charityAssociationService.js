import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all charity associations
export const getAllCharityAssociations = async (userToken) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.CHARITY_ASSOCIATIONS.GET_ALL,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch charity associations");
  }
};

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


// Get a specific charity association by ID
export const getCharityAssociationById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CHARITY_ASSOCIATIONS.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch charity association");
  }
};

// Create a new charity association
export const createCharityAssociation = async (charityData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.CHARITY_ASSOCIATIONS.CREATE,
      charityData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create charity association");
  }
};

// Update a charity association by ID
export const updateCharityAssociation = async (id, charityData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.CHARITY_ASSOCIATIONS.UPDATE}/${id}`,
      charityData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update charity association");
  }
};

// Delete a charity association by ID
export const deleteCharityAssociation = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.CHARITY_ASSOCIATIONS.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete charity association");
  }
};
