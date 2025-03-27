import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";
import API_ENDPOINTS from "../config/config";

const PreciousMetalsContext = createContext();

export const usePreciousMetals = () => useContext(PreciousMetalsContext);

export const PreciousMetalsProvider = ({ children }) => {
  const [goldData, setGoldData] = useState(null);
  const [silverData, setSilverData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [baseCode, setCurrencyBaseCode] = useState("EUR");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check AsyncStorage for existing gold data and expiry timestamp
        const storedGoldData = await AsyncStorage.getItem("goldData");
        const goldExpiry = await AsyncStorage.getItem("goldExpiry");
        const savedBaseCode = await AsyncStorage.getItem("baseCode");
        // if (
        //   storedGoldData &&
        //   goldExpiry &&
        //   Date.now() < parseInt(goldExpiry) &&
        //   savedBaseCode === baseCode
        // ) {
        //   setGoldData(JSON.parse(storedGoldData));
        // } else {
        // Fetch gold data from API if not found in AsyncStorage or expired
        const goldHeaders = new Headers();
        goldHeaders.append("x-access-token", process.env.GOLD_API_KEY);
        goldHeaders.append("Content-Type", "application/json");

        const goldRequestOptions = {
          method: "GET",
          headers: goldHeaders,
          redirect: "follow",
        };

        const goldResponse = await fetch(
          // process.env.GOLD_API_URL,
          API_ENDPOINTS.PRECIOUS_METALS.GOLD_PRICES,
          goldRequestOptions
        );
        if (!goldResponse.ok) {
          throw new Error("Failed to fetch gold data");
        }
        const goldResult = await goldResponse.json();
        setGoldData(goldResult);
        // Save gold data and expiry timestamp to AsyncStorage
        await AsyncStorage.setItem("goldData", JSON.stringify(goldResult));
        await AsyncStorage.setItem(
          "goldExpiry",
          String(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ); // One month expiry
        // }

        // Similar logic for silver data
        // Check AsyncStorage for existing silver data and expiry timestamp
        const storedSilverData = await AsyncStorage.getItem("silverData");
        const silverExpiry = await AsyncStorage.getItem("silverExpiry");
        // if (
        //   storedSilverData
        //   // && silverExpiry && Date.now() < parseInt(silverExpiry)
        // ) {
        //   setSilverData(JSON.parse(storedSilverData));
        // } else {
        // Fetch silver data from API if not found in AsyncStorage or expired
        const silverHeaders = new Headers();
        silverHeaders.append("x-access-token", process.env.SILVER_API_KEY);
        silverHeaders.append("Content-Type", "application/json");

        const silverRequestOptions = {
          method: "GET",
          headers: silverHeaders,
          redirect: "follow",
        };

        const silverResponse = await fetch(
          API_ENDPOINTS.PRECIOUS_METALS.SILVER_PRICES,
          silverRequestOptions
        );
        if (!silverResponse.ok) {
          throw new Error("Failed to fetch silver data");
        }
        const silverResult = await silverResponse.json();
        setSilverData(silverResult);
        // Save silver data and expiry timestamp to AsyncStorage
        await AsyncStorage.setItem("silverData", JSON.stringify(silverResult));
        await AsyncStorage.setItem(
          "silverExpiry",
          String(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ); // One month expiry
        // }
      } catch (error) {
        console.error("Error fetching precious metals data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PreciousMetalsContext.Provider
      value={{ goldData, silverData, setCurrencyBaseCode, loading }}
    >
      {children}
    </PreciousMetalsContext.Provider>
  );
};
