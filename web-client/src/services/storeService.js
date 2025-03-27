import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "./getCommonHeaders";

// Fetch all products with pagination and filtering
export const getAllProducts = async (keywords, page, limit, userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.STORE.GET_ALL_PRODUCTS, {
      headers: getCommonHeaders(userToken),
      params: {
        page,
        limit,
        keywords,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products");
  }
};
//fetch all my products
export const getMyProducts = async (keywords, page, limit, userToken) => {
  try {
    const response = await axios.get(API_ENDPOINTS.STORE.GET_MY_PRODUCTS, {
      headers: getCommonHeaders(userToken),
      params: {
        page,
        limit,
        keywords,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to fetch products");
  }
};

// Fetch a single product by ID
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

// Search products in a category
export const searchProductsInCategory = async (
  id,
  keywords,
  page,
  limit,
  userToken
) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.STORE.SEARCH_PRODUCTS_IN_CATEGORY}`,
      {
        headers: getCommonHeaders(userToken),
        params: {
          page,
          limit,
          keywords,
          id,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to search products");
  }
};

// Add a new product
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

// Add a new stock
export const addStockHistory = async (payload, userToken) => {
  try {
    const response = await axios.patch(
      API_ENDPOINTS.STORE.CREATE_PRODUCT,
      payload,
      {
        headers: getCommonHeaders(userToken),
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error || "Failed to add product");
  }
};

// Update an existing product
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

// Delete a product
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
// Delete my product
export const deleteMyProduct = async (id, userToken) => {
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

// Fetch all categories
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

// Fetch a single category by ID
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

// Add a new category
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

// Update an existing category
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

// Delete a category
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
