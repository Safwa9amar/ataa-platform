// src/services/likeService.js
import axios from "axios";
import API_ENDPOINTS from "../config/config"; // Adjust the path according to your project structure
import { getCommonHeaders } from "./getCommonHeaders";

// Add a like for a specific charity
export const addLike = async (charityId, userToken) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.LIKES.ADD}/${charityId}`,
      {},
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add like");
  }
};

// Get all likes for a specific charity
export const getLikesByCharity = async (charityId, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.LIKES.GET_BY_CHARITY}/${charityId}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch likes");
  }
};

// Delete a like by ID
export const deleteLike = async (id, userToken) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.LIKES.DELETE}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete like");
  }
};
