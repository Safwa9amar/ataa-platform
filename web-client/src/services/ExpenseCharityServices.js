// src/services/ExpenseCharityServices.js
import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

/**
 * Create a new expense record
 * @param {object} expenseData - Expense data to create
 * @param {string} userToken - Authentication token
 */
export const createExpense = async (expenseData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.EXPENSE.CREATE,
      expenseData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create expense record");
  }
};

/**
 * Get all expense records with optional filters
 * @param {object} filters - Optional filters { userId, startDate, endDate, expenseType }
 * @param {string} userToken - Authentication token
 */
export const getAllExpenses = async (filters = {}, userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.EXPENSE.GET_ALL, {
      params: filters,
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch expenses");
  }
};

/**
 * Get specific expense by ID
 * @param {string} id - Expense ID
 * @param {string} userToken - Authentication token
 */
export const getExpenseById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.EXPENSE.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch expense");
  }
};

/**
 * Update existing expense record
 * @param {string} id - Expense ID
 * @param {object} expenseData - Updated expense data
 * @param {string} userToken - Authentication token
 */
export const updateExpense = async (id, expenseData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.EXPENSE.UPDATE}/${id}`,
      expenseData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update expense record");
  }
};

/**
 * Delete expense record
 * @param {string} id - Expense ID
 * @param {string} userToken - Authentication token
 */
export const deleteExpense = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.EXPENSE.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete expense record");
  }
};