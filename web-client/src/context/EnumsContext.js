import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import API_ENDPOINTS from "@/config/apiEndPoints";

// Create the context
const EnumsContext = createContext();

// Provider component
export const EnumsProvider = ({ children }) => {
  const [enums, setEnums] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch enums from the server
  useEffect(() => {
    const fetchEnums = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_ENUMS); // Replace with your API endpoint
        setEnums(response.data);
      } catch (err) {
        console.log("Error fetching enums:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEnums();
  }, []);

  return (
    <EnumsContext.Provider value={{ enums, loading, error }}>
      {children}
    </EnumsContext.Provider>
  );
};

// Custom hook to use the EnumsContext
export const useEnums = () => {
  return useContext(EnumsContext);
};
