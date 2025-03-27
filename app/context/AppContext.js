// AppContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AppContext = createContext();
export const useAppContext = () => React.useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState(false);
  const [screensAnimation, setScreensAnimation] = useState("slide_from_right");
  const [
    DonationCardDetailsCarouselAnimation,
    setDonationCardDetailsCarouselAnimation,
  ] = useState("stack");

  useEffect(() => {
    // Check if the app has been used before
    // AsyncStorage.clear(); // Clear AsyncStorage for testing purposes
    AsyncStorage.getItem("usingForFirstTime").then((value) => {
      if (value !== null) {
        setIsFirstTime(false); // App has been used before
      }
    });
  }, []);

  const contextValue = {
    isFirstTime,
    appIsReady,
    serverStatus,
    setAppIsReady,
    loading,
    setLoading,
    userInterface: {
      screensAnimation,
      setScreensAnimation,
      DonationCardDetailsCarouselAnimation,
      setDonationCardDetailsCarouselAnimation,
    },
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppContext;
