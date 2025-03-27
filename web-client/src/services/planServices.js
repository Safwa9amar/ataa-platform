import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all plans
export const getAllPlans = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.PLANS.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch plans");
  }
};

// Get a plan by ID
export const getPlanById = async (id, userToken) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.PLANS.GET_BY_ID}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch plan");
  }
};

// Create a new plan
export const createPlan = async (planData, userToken) => {
  try {
    const response = await axios.post(API_ENDPOINTS.PLANS.CREATE, planData, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create plan");
  }
};

// Update a plan by ID
export const updatePlan = async (id, planData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.PLANS.UPDATE}/${id}`,
      planData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update plan");
  }
};

// Delete a plan by ID
export const deletePlan = async (id, userToken) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.PLANS.DELETE}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete plan");
  }
};
