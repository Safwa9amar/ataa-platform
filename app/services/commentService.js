import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "./getCommonHeaders";



// Get all comments for a specific charity by charityId
export const getAllCommentsByCharityId = async (charityId, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.COMMENTS.GET_ALL_BY_CHARITY}/${charityId}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch comments");
  }
};

// Get a specific comment by ID
export const getCommentById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.COMMENTS.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch comment");
  }
};

// Create a new comment
export const createComment = async (commentData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.COMMENTS.CREATE,
      commentData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to create comment");
  }
};

// Update a comment by ID
export const updateComment = async (id, commentData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.COMMENTS.UPDATE}/${id}`,
      commentData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update comment");
  }
};

// Delete a comment by ID
export const deleteComment = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.COMMENTS.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete comment");
  }
};
