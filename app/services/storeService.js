import axios from "axios";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "./getCommonHeaders";


// Create an Axios instance (optional if you want to set base URL globally)
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
// });

export const getAllProducts = async (keywords, page, limit, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.STORE.GET_ALL_PRODUCTS}/${page}/${limit}/${keywords}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};

export const getProductById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.STORE.GET_PRODUCT_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product");
  }
};

export const searchProductsInCategory = async (
  id,
  keywords,
  page,
  limit,
  userToken
) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.STORE.SEARCH_PRODUCTS_IN_CATEGORY}/${id}/${page}/${limit}/${keywords}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to search products");
  }
};

export const addProduct = async (product, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.STORE.CREATE_PRODUCT,
      product,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add product");
  }
};

export const updateProduct = async (id, product, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.STORE.UPDATE_PRODUCT}/${id}`,
      product,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update product");
  }
};

export const deleteProduct = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.STORE.DELETE_PRODUCT}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete product");
  }
};

export const getAllCategories = async (userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.STORE.GET_ALL_CATEGORIES, {
      headers: getCommonHeaders(userToken),
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories");
  }
};

export const getCategoryById = async (id, userToken) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.STORE.GET_CATEGORY_BY_ID}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch category");
  }
};

export const addCategory = async (category, userToken) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.STORE.CREATE_CATEGORY,
      category,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to add category");
  }
};

export const updateCategory = async (id, category, userToken) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.STORE.UPDATE_CATEGORY}/${id}`,
      category,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (id, userToken) => {
  try {
    const response = await axios.delete(
      `${API_ENDPOINTS.STORE.DELETE_CATEGORY}/${id}`,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};
