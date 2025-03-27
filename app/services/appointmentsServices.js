import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all appointments
export const getAllAppointments = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.APPOINTMENTS.GET_ALL, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch appointments");
  }
};

// Get an appointment by ID
export const getAppointmentById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.APPOINTMENTS.GET_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch appointment");
  }
};

export const getAppointmentByUserId = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.APPOINTMENTS.GET_BY_USER_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch appointment");
  }
};

// Create a new appointment
export const createAppointment = async (appointmentData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPOINTMENTS.CREATE,
      appointmentData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create appointment");
  }
};

// Update an appointment by ID
export const updateAppointment = async (id, appointmentData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.APPOINTMENTS.UPDATE}/${id}`,
      appointmentData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update appointment");
  }
};

// Delete an appointment by ID
export const deleteAppointment = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.APPOINTMENTS.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete appointment");
  }
};
