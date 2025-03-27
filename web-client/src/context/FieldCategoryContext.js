"use client";
// FieldCategoryContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { getAllFields, getFieldById } from "@/services/fieldService";
import { useCredentials } from "./CredentialsContext";

const FieldCategoryContext = createContext();

export const useFieldCategoryContext = () => useContext(FieldCategoryContext);

export const FieldCategoryProvider = ({ children }) => {
  const { userToken } = useCredentials();
  const [fields, setFields] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFields = async () => {
    setLoading(true);
    setCategories([]);
    try {
      const data = await getAllFields(userToken);
      setFields(data);
      setSelectedField(data[0].id);
    } catch (error) {
      console.error("Error fetching fields:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategories([]);
    setLoading(true);
    try {
      const data = await getFieldById(selectedField, userToken);
      setCategories(data.categories);
    } catch (error) {
      setCategories([]);
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  useEffect(() => {
    if (selectedField) {
      fetchCategories();
    }
  }, [selectedField]);

  const contextValue = {
    fields,
    selectedField,
    setSelectedField,
    categories,
    loading,
  };

  return (
    <FieldCategoryContext.Provider value={contextValue}>
      {children}
    </FieldCategoryContext.Provider>
  );
};

export default FieldCategoryContext;
