import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getAllProducts,
  getAllCategories,
  getCategoryById,
  searchProductsInCategory,
} from "../services/storeService";
import { useCredentials } from "./CredentialsContext";

// Create the context
const StoreContext = createContext();

// Define initial state
const initialState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
};

// Define the reducer function
const storeReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_PRODUCTS":
      return { ...state, products: action.payload, loading: false };
    case "APPEND_PRODUCTS":
      return {
        ...state,
        products: [...state.products, ...action].filter(
          (product, index, self) =>
            index === self.findIndex((t) => t.id === product.id)
        ),
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: [{ id: 550, name: "جميع الأصناف" }, ...action.payload],
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "RESET_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create a provider component
export const StoreProvider = ({ children }) => {
  const { userToken } = useCredentials();
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      getALLProducts("", 1, 10);
      dispatch({ type: "SET_LOADING" });
      try {
        const categoriesData = await getAllCategories(userToken);
        dispatch({ type: "SET_CATEGORIES", payload: categoriesData });
      } catch (err) {
        console.error("Error fetching data:", err.message);
        dispatch({
          type: "SET_ERROR",
          payload:
            "حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى لاحقاً.",
        });
      }
    };
    fetchData();
  }, [userToken]);

  const getCategoryByID = async (id) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const cat = await getCategoryById(id, userToken);
      if (cat) {
        dispatch({ type: "SET_PRODUCTS", payload: cat.products });
      }
    } catch (err) {
      console.error("Error fetching category:", err.message);
      dispatch({
        type: "SET_ERROR",
        payload:
          "حدث خطأ أثناء تحميل بيانات التصنيف. يرجى المحاولة مرة أخرى لاحقاً.",
      });
    }
  };

  const getALLProducts = async (keywords, page, limit) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const productsData = await getAllProducts(
        keywords,
        page,
        limit,
        userToken
      );
      if (productsData) {
        dispatch({ type: "SET_PRODUCTS", payload: productsData });
      }
    } catch (err) {
      console.error("Error fetching products:", err.message);
      dispatch({
        type: "SET_ERROR",
        payload: "حدث خطأ أثناء تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.",
      });
    }
  };

  const searchProducts = async (id, keywords, page, limit) => {
    dispatch({ type: "SET_LOADING" });
    try {
      const productsData = await searchProductsInCategory(
        id,
        keywords,
        page,
        limit,
        userToken
      );
      if (productsData) {
        dispatch({ type: "SET_PRODUCTS", payload: productsData });
      }
    } catch (err) {
      console.error("Error searching products:", err.message);
      dispatch({
        type: "SET_ERROR",
        payload:
          "حدث خطأ أثناء البحث عن المنتجات. يرجى المحاولة مرة أخرى لاحقاً.",
      });
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products: state.products,
        categories: state.categories,
        loading: state.loading,
        error: state.error,
        getALLProducts,
        getCategoryByID,
        searchProducts,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use the StoreContext
export const useStore = () => {
  return useContext(StoreContext);
};
