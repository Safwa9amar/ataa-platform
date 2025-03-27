import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ZakatContext = createContext();

export const ZakatProvider = ({ children }) => {
  const [zakatData, setZakatData] = useState([]);

  useEffect(() => {
    const loadZakatData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("zakatData");
        if (storedData) {
          setZakatData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load Zakat data from storage:", error);
      }
    };

    loadZakatData();
  }, []);

  const saveZakatData = async (data) => {
    try {
      await AsyncStorage.setItem("zakatData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save Zakat data to storage:", error);
    }
  };

  const deleteZakat = (index) => {
    const updatedData = zakatData.filter((_, i) => i !== index);
    setZakatData(updatedData);
    saveZakatData(updatedData);
  };

  const addZakat = (ar_name, amount, amountType) => {
    amount = parseFloat(amount);
    let updatedData = [];
    if (!ar_name || !amount || amount <= 0) return;
    // check if amountType is already added
    const isAlreadyAdded = zakatData.some(
      (item) => item.amountType === amountType
    );
    if (isAlreadyAdded) {
      updatedData = zakatData.map((item) =>
        item.amountType === amountType ? { ...item, amount: amount } : item
      );
    } else {
      // add new amountType
      updatedData = [...zakatData, { ar_name, amount, amountType }];
    }

    setZakatData(updatedData);
    saveZakatData(updatedData);
  };

  const emptyZakatData = () => {
    setZakatData([]);
    saveZakatData([]);
  };

  const totalAmount = useMemo(() => {
    return Math.floor(
      zakatData.reduce((total, item) => total + parseFloat(item.amount), 0)
    );
  }, [zakatData]);

  return (
    <ZakatContext.Provider
      value={{ zakatData, deleteZakat, addZakat, totalAmount, emptyZakatData }}
    >
      {children}
    </ZakatContext.Provider>
  );
};

export const useZakat = () => useContext(ZakatContext);
