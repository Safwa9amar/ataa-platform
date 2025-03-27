// src/services/InvoiceCharityServices.js
import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

/**
 * Create a new invoice/payment record
 * @param {object} invoiceData - Invoice data to create
 * @param {string} userToken - Authentication token
 */
export const createInvoice = async (invoiceData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.INVOICE.CREATE,
      invoiceData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create invoice");
  }
};

/**
 * Get all invoices with optional filters
 * @param {object} filters - Optional filters { status, startDate, endDate }
 * @param {string} userToken - Authentication token
 */
export const getAllInvoices = async (filters = {}, userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.INVOICE.GET_ALL, {
      params: filters,
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch invoices");
  }
};

/**
 * Get specific invoice by ID
 * @param {string} id - Invoice ID
 * @param {string} userToken - Authentication token
 */
export const getInvoiceById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.INVOICE.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch invoice");
  }
};

/**
 * Update existing invoice record
 * @param {string} id - Invoice ID
 * @param {object} invoiceData - Updated invoice data
 * @param {string} userToken - Authentication token
 */
export const updateInvoice = async (id, invoiceData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.INVOICE.UPDATE}/${id}`,
      invoiceData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update invoice");
  }
};

/**
 * Delete invoice record
 * @param {string} id - Invoice ID
 * @param {string} userToken - Authentication token
 */
export const deleteInvoice = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.INVOICE.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete invoice");
  }
};