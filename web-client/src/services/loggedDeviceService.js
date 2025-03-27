import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Function to save state to localStorage
export const saveStateToLocalStorage = (state) => {
  try {
    localStorage.setItem("loggedDeviceData", JSON.stringify(state));
    if (state.token) {
      localStorage.setItem("authToken", state.token);
    } else {
      localStorage.removeItem("authToken");
    }
  } catch (error) {
    console.error("Failed to save logged device data", error);
  }
};

// Get all logged devices for a specific user
const getLoggedDevices = async (userToken) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.LOGGED_DEVICES.GET}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching logged devices for user ID `, error);
    throw error;
  }
};

// Create a new logged device
const createLoggedDevice = async (userId, deviceData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.LOGGED_DEVICES.CREATE,
      { userId, ...deviceData },
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating logged device:", error);
    throw new Error(
      error.response?.data?.error || "Error creating logged device"
    );
  }
};

// Update last login for a specific device
const updateLastLogin = async (deviceId, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.LOGGED_DEVICES.UPDATE}${deviceId}`,
      {},
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating last login for device ID ${deviceId}:`,
      error
    );
    throw error;
  }
};

// Delete a logged device by ID
const deleteLoggedDevice = async (deviceId, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.LOGGED_DEVICES}${deviceId}`,
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting logged device with ID ${deviceId}:`, error);
    throw error;
  }
};

export {
  getLoggedDevices,
  createLoggedDevice,
  updateLastLogin,
  deleteLoggedDevice,
};
