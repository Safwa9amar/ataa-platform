import React, { createContext, useState, useEffect } from "react";
import API_ENDPOINTS from "../config/apiEndPoints";
import { getCommonHeaders } from "../services/getCommonHeaders";

const AlgeriaCitiesContext = createContext();

export const useAlgeriaCitiesContext = () =>
  React.useContext(AlgeriaCitiesContext);

export const AlgeriaCitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [wilayas, setWilayas] = useState([]);
  const [dairas, setDairas] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState({
    cities: true,
    wilayas: true,
    dairas: true,
    communes: true,
  });

  const BASE_URL = API_ENDPOINTS.BASE_URL;
  const CITIES_URL = `${BASE_URL}/algeria-cities`;
  const WILAYAS_URL = `${BASE_URL}/algeria-cities/wilayas`;
  const { userToken } = ""; // Replace with actual token handling logic.

  const fetchCities = async () => {
    setLoading((prev) => ({ ...prev, cities: true }));
    try {
      const response = await fetch(CITIES_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading((prev) => ({ ...prev, cities: false }));
    }
  };

  const fetchWilayas = async () => {
    setLoading((prev) => ({ ...prev, wilayas: true }));
    try {
      const response = await fetch(WILAYAS_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setWilayas(data);
    } catch (error) {
      console.error("Error fetching wilayas:", error);
    } finally {
      setLoading((prev) => ({ ...prev, wilayas: false }));
    }
  };

  const fetchDairas = async (wilayaCode) => {
    setLoading((prev) => ({ ...prev, dairas: true }));
    let code = parseInt(wilayaCode);
    const DAIRAS_URL = `${BASE_URL}/algeria-cities/${code}/dairas`;
    try {
      const response = await fetch(DAIRAS_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setDairas(data);
    } catch (error) {
      console.error("Error fetching dairas:", error);
    } finally {
      setLoading((prev) => ({ ...prev, dairas: false }));
    }
  };

  const fetchCommunes = async (wilayaCode, dairaName) => {
    setLoading((prev) => ({ ...prev, communes: true }));
    const COMMUNES_URL = `${BASE_URL}/algeria-cities/${wilayaCode}/dairas/${dairaName}`;
    try {
      const response = await fetch(COMMUNES_URL, {
        headers: getCommonHeaders(userToken),
      });
      const data = await response.json();
      setCommunes(data);
    } catch (error) {
      console.error("Error fetching communes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, communes: false }));
    }
  };

  const getWilayaByCode = (code) => {
    return wilayas.find((wilaya) => wilaya.wilaya_code === code);
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
    loading, // Expose loading state
    getWilayaByCode,
    fetchDairas,
    fetchCommunes,
  };

  return (
    <AlgeriaCitiesContext.Provider value={contextValue}>
      {children}
    </AlgeriaCitiesContext.Provider>
  );
};

export default AlgeriaCitiesContext;
