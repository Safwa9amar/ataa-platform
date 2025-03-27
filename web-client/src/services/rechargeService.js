// src/services/rechargeService.js

import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all recharges
export const getAllRecharges = async (
  page = 1,
  limit = 10,
  createdAt,
  userToken
) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.RECHARGE.GET_ALL}/${page}/${limit}/${createdAt}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recharges", error.message);
    throw new Error("Failed to fetch recharges");
  }
};

// Get a specific recharge by ID
export const getRechargeById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.RECHARGE.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch recharge", error.message);
    throw new Error("Failed to fetch recharge");
  }
};

// Create a new recharge
export const createRecharge = async (rechargeData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.RECHARGE.CREATE,
      rechargeData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create recharge", error.message);
    throw new Error("Failed to create recharge");
  }
};

// Update a recharge by ID
export const updateRecharge = async (id, rechargeData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.RECHARGE.UPDATE}/${id}`,
      rechargeData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update recharge", error.message);
    throw new Error("Failed to update recharge");
  }
};

// Delete a recharge by ID
export const deleteRecharge = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.RECHARGE.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete recharge", error.message);
    throw new Error("Failed to delete recharge");
  }
};
