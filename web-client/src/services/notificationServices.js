import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Create a new notification
export const createNotification = async (notificationData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.NOTIFICATION,
      notificationData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create notification");
  }
};

// Fetch all NOTIFICATION for a user
export const getNotificationsByUserId = async (userId, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.NOTIFICATION}/${userId}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch NOTIFICATION");
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (id, userToken) => {
  try {
    const response = await axios.patch(
      `${API_ENDPOINTS.NOTIFICATION}/${id}/read`,
      {},
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to mark notification as read");
  }
};

// Delete a notification
export const deleteNotification = async (id, userToken) => {
  try {
    const response = await axios.delete(`${API_ENDPOINTS.NOTIFICATION}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete notification");
  }
};
