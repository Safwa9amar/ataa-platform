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
        // Check localStorage for existing currency data and expiry timestamp
        const storedCurrencyData = localStorage.getItem("currencyData");
        const currencyExpiry = localStorage.getItem("currencyExpiry");
        const storedBaseCurrency = localStorage.getItem("baseCurrency");

        if (
          storedCurrencyData &&
          currencyExpiry &&
          Date.now() < parseInt(currencyExpiry) &&
          storedBaseCurrency === baseCurrency
        ) {
          // Use cached currency data
          setCurrencyData(JSON.parse(storedCurrencyData));
        } else {
          // Fetch currency data from API if not found in localStorage or expired
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_CURRENCY_API_URL}&base_currency=${baseCurrency}`,
            {
              headers: getCommonHeaders(userToken),
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch currency data");
          }
          const result = await response.json();
          setCurrencyData(result);

          // Save currency data and expiry timestamp to localStorage
          localStorage.setItem("currencyData", JSON.stringify(result));
          localStorage.setItem(
            "currencyExpiry",
            String(Date.now() + 30 * 24 * 60 * 60 * 1000) // One month expiry
          );
          localStorage.setItem("baseCurrency", baseCurrency);
        }
      } catch (error) {
        console.error("Error fetching currency data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseCurrency, userToken]);

  return (
    <CurrencyContext.Provider
      value={{ currencyData, setBaseCurrency, loading }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
