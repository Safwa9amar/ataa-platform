// AlgeriaCitiesContext.js

import React, { createContext, useState, useEffect } from "react";
import API_ENDPOINTS from "../config/config";
import { getCommonHeaders } from "../services/getCommonHeaders";
import { useCredentials } from "./CredentialsContext";

const AlgeriaCitiesContext = createContext();

export const useAlgeriaCitiesContext = () =>
  React.useContext(AlgeriaCitiesContext);

export const AlgeriaCitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [dairas, setDairas] = useState([]);
  const [communes, setCommunes] = useState([]);
  const BASE_URL = API_ENDPOINTS.BASE_URL;
  const CITIES_URL = `${BASE_URL}/algeria-cities`;
  const WILAYAS_URL = `${BASE_URL}/algeria-cities/wilayas`;
  const { userToken } = useCredentials();

  const fetchCities = async () => {
    try {
      const response = await fetch(CITIES_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const fetchWilayas = async () => {
    try {
      const response = await fetch(WILAYAS_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setWilayas(data);
    } catch (error) {
      console.error("Error fetching wilayas:", error);
    }
  };

  const fetchDairas = async (wilayaCode) => {
    let code = parseInt(wilayaCode);
    const DAIRAS_URL = `${BASE_URL}/algeria-cities/${code}/dairas`;
    console.log(DAIRAS_URL);
    try {
      const response = await fetch(DAIRAS_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setDairas(data);
    } catch (error) {
      console.error("Error fetching dairas:", error);
    }
  };

  const fetchCommunes = async (wilayaCode, dairaName) => {
    const COMMUNES_URL = `${BASE_URL}/algeria-cities/${wilayaCode}/dairas/${dairaName}`;
    console.log(COMMUNES_URL);
    try {
      const response = await fetch(COMMUNES_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setCommunes(data);
    } catch (error) {
      console.error("Error fetching communes:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    fetchWilayas();
  }, []);

  const contextValue = {
    cities,
    wilayas,
    dairas,
    communes,
    fetchDairas, // Expose fetchDairas to allow fetching by wilayaCode dynamically
    fetchCommunes, // Expose fetchCommunes to allow fetching by wilayaCode and dairaName dynamically
  };

  return (
    <AlgeriaCitiesContext.Provider value={contextValue}>
      {children}
    </AlgeriaCitiesContext.Provider>
  );
};

export default AlgeriaCitiesContext;
