import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Get all testimonials
export const getAllTestimonials = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.TESTIMONIALS, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch testimonials");
  }
};

// Get a testimonial by ID
export const getTestimonialById = async (id, userToken) => {
  try {
    const response = await axios.get(`${API_ENDPOINTS.TESTIMONIALS}/${id}`, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to fetch testimonial");
  }
};

// Create a new testimonial
export const createTestimonial = async (testimonialData, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.TESTIMONIALS,
      testimonialData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to create testimonial");
  }
};

// Update a testimonial by ID
export const updateTestimonial = async (id, testimonialData, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.TESTIMONIALS}/${id}`,
      testimonialData,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to update testimonial");
  }
};

// Delete a testimonial by ID
export const deleteTestimonial = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.TESTIMONIALS.DELETE}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
    throw new Error("Failed to delete testimonial");
  }
};
