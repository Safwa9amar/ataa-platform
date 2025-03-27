import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all incomes (with optional filters)
export const getAllIncomes = async (filters = {}, userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.INCOME.GET_ALL, {
      params: filters,
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch incomes");
  }
};

// Get income by ID
export const getIncomeById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.INCOME.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch income");
  }
};

// Create new income record
export const createIncome = async (incomeData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.INCOME.CREATE,
      incomeData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create income record");
  }
};

// Update existing income record
export const updateIncome = async (id, incomeData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.INCOME.UPDATE}/${id}`,
      incomeData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update income record");
  }
};

// Delete income record
export const deleteIncome = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.INCOME.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete income record");
  }
};