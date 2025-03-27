import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCommonHeaders } from "../services/getCommonHeaders";
import { useCredentials } from "./CredentialsContext";

const CurrencyContext = createContext();

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  const [currencyData, setCurrencyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [baseCurrency, setBaseCurrency] = useState("DZD");
  const { userToken } = useCredentials();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check AsyncStorage for existing currency data and expiry timestamp
        const storedCurrencyData = await AsyncStorage.getItem("currencyData");
        const currencyExpiry = await AsyncStorage.getItem("currencyExpiry");
        const storedBaseCurrency = await AsyncStorage.getItem("baseCurrency");
        if (
          storedCurrencyData &&
          currencyExpiry &&
          Date.now() < parseInt(currencyExpiry) &&
          storedBaseCurrency === baseCurrency
        ) {
          setCurrencyData(JSON.parse(storedCurrencyData));
        } else {
          // Fetch currency data from API if not found in AsyncStorage or expired
          const response = await fetch(
            `${process.env.CURRENCY_API_URL}&base_currency=${baseCurrency}`,
            {
              headers: getCommonHeaders(userToken),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch currency data");
          }
          const result = await response.json();
          setCurrencyData(result);
          // Save currency data and expiry timestamp to AsyncStorage
          await AsyncStorage.setItem("currencyData", JSON.stringify(result));
          await AsyncStorage.setItem(
            "currencyExpiry",
            String(Date.now() + 30 * 24 * 60 * 60 * 1000)
          ); // One month expiry
        }
      } catch (error) {
        console.error("Error fetching currency data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseCurrency]);

  return (
    <CurrencyContext.Provider
      value={{ currencyData, setBaseCurrency, loading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
