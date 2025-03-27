import { useEffect, useState } from "react";
import * as Font from "expo-font";

const useLoadFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          ElMessiri: require("../assets/fonts/ElMessiri.ttf"),
          // Add more font families if needed
          ReemKufi: require("../assets/fonts/ReemKufi-Medium.ttf"),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };

    loadFonts();
  }, []);
  return fontsLoaded;
};

export default useLoadFonts;
