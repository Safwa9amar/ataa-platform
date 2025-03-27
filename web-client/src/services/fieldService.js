// src/services/fieldService.js
import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all fields with associated categories
export const getAllFields = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.FIELD.GET_FIELDS, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch fields");
  }
};

// Get a specific field by ID
export const getFieldById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.FIELD.GET_FIELDS}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch field");
  }
};

// Get a specific category by ID
export const getCategoryById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch field");
  }
};



// Create a new field
export const createField = async (fieldData, userToken) => {
  try {
    const response = await axios.post(API_ENDPOINTS.FIELD.CREATE, fieldData, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create field");
  }
};

// Update a field by ID
export const updateField = async (id, fieldData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.FIELD.UPDATE}/${id}`,
      fieldData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update field");
  }
};

// Delete a field by ID
export const deleteField = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.FIELDS.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete field");
  }
};
