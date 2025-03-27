import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints"; // Adjust this path based on your project structure
import { getCommonHeaders } from "./getCommonHeaders";

// Get all users
export const getAllUsers = async (keywords, period, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.USERS.GET_ALL}/${period}/${keywords}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error("error while fetch all users", error.message);
    throw new Error("Failed to fetch users");
  }
};

// Get a specific user by ID
export const getUserById = async (id, userToken) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.USERS.GET_BY_ID}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user");
  }
};

// Create a new user
export const createUser = async (userData, userToken) => {
  try {
    const response = await axios.post(API_ENDPOINTS.USERS.CREATE, userData, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

// Update a user by ID
export const updateUser = async (id, userData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.USERS.UPDATE}/${id}`,
      userData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

// Delete a user by ID
export const deleteUser = async (id, userToken) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.USERS.DELETE}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};


export const updatePassword = async (
  userToken,
  currentPassword,
  newPassword
) => {
  try {
    const response = await axios.put(
      API_ENDPOINTS.USERS.UPDATE_PASSWORD,
      { currentPassword, newPassword },
      { headers: getCommonHeaders(userToken) }
    );
    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error(
      error.response?.data?.message || "Failed to update password."
    );
  }
};