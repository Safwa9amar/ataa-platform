// FieldCategoryContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "../services/getCommonHeaders";

const FieldCategoryContext = createContext();

export const useFieldCategoryContext = () => useContext(FieldCategoryContext);

export const FieldCategoryProvider = ({ children }) => {
  const [fields, setFields] = useState([]);
  const [categories, setCategories] = useState([]);
  const FIELDS_URL = API_ENDPOINTS.FIELD.GET_FIELDS;
  const CATEGORIES_URL = API_ENDPOINTS.CATEGORY.GET_CATEGORIES;

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch(FIELDS_URL, {
          headers: getCommonHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch fields");
        const data = await response.json();
        setFields(data);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORIES_URL, {
          headers: getCommonHeaders(),
        });
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchFields();
    fetchCategories();
  }, [FIELDS_URL, CATEGORIES_URL]);

  const contextValue = {
    fields,
    categories,
  };

  return (
    <FieldCategoryContext.Provider value={contextValue}>
      {children}
    </FieldCategoryContext.Provider>
  );
};

export default FieldCategoryContext;
