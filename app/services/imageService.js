import axios from 'axios';
import API_ENDPOINTS from '../config/config';
import { getCommonHeaders } from "./getCommonHeaders";

// Base Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all images
 * @param {string} userToken - User's authentication token
 */
export const getAllImages = async (userToken) => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.IMAGES.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error.message);
    throw new Error("Failed to fetch images");
  }
};

/**
 * Get an image by ID
 * @param {number} id - Image ID
 * @param {string} userToken - User's authentication token
 */
export const getImageById = async (id, userToken) => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.IMAGES.GET_BY_ID}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching image with ID ${id}:`, error.message);
    throw new Error(`Failed to fetch image with ID ${id}`);
  }
};

/**
 * Create a new image
 * @param {object} imageData - Image data
 * @param {string} userToken - User's authentication token
 */
export const createImage = async (imageData, userToken) => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.IMAGES.CREATE, imageData, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating image:", error.message);
    throw new Error("Failed to create image");
  }
};

/**
 * Update an image by ID
 * @param {number} id - Image ID
 * @param {object} imageData - Image data
 * @param {string} userToken - User's authentication token
 */
export const updateImage = async (id, imageData, userToken) => {
  try {
    const response = await apiClient.put(`${API_ENDPOINTS.IMAGES.UPDATE}/${id}`, imageData, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating image with ID ${id}:`, error.message);
    throw new Error(`Failed to update image with ID ${id}`);
  }
};

/**
 * Delete an image by ID
 * @param {number} id - Image ID
 * @param {string} userToken - User's authentication token
 */
export const deleteImage = async (id, userToken) => {
  try {
    const response = await apiClient.delete(`${API_ENDPOINTS.IMAGES.DELETE}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting image with ID ${id}:`, error.message);
    throw new Error(`Failed to delete image with ID ${id}`);
  }
};
