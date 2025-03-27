import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { toast } from "react-toastify";

const ZakatContext = createContext();

export const ZakatProvider = ({ children }) => {
  const [zakatData, setZakatData] = useState([]);

  // Load Zakat data from localStorage
  useEffect(() => {
    const loadZakatData = () => {
      try {
        const storedData = localStorage.getItem("zakatData");
        if (storedData) {
          setZakatData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Failed to load Zakat data from storage:", error);
      }
    };

    loadZakatData();
  }, []);

  // Save Zakat data to localStorage
  const saveZakatData = (data) => {
    try {
      localStorage.setItem("zakatData", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save Zakat data to storage:", error);
    }
  };

  // Add Zakat entry
  const addZakat = (ar_name, amount, amountType) => {
    amount = parseFloat(amount);
    let updatedData = [];
    if (!ar_name || !amount || amount <= 0) return;

    // Check if amountType is already added
    const isAlreadyAdded = zakatData.some(
      (item) => item.amountType === amountType
    );

    if (isAlreadyAdded) {
      updatedData = zakatData.map((item) =>
        item.amountType === amountType ? { ...item, amount } : item
      );
    } else {
      // Add new amountType
      updatedData = [...zakatData, { ar_name, amount, amountType }];
    }

    setZakatData(updatedData);
    saveZakatData(updatedData);
  };

  // Delete Zakat entry by index
  const deleteZakat = (index) => {
    try {
      const updatedData = zakatData.filter((_, i) => i !== index);
      setZakatData(updatedData);
      saveZakatData(updatedData);
      toast.success("ثم الحذف بنجاح", {
        position: "bottom-left",
        toastId: index,
      });
    } catch (error) {
      toast.error("حدث خطأ اثناء الحذف الرجاء المحاولة", {
        position: "bottom-left",
        toastId: index,
      });
    }
  };

  // Empty all Zakat data
  const emptyZakatData = () => {
    setZakatData([]);
    saveZakatData([]);
  };

  // Calculate total Zakat amount
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

// Custom hook to use Zakat context
export const useZakat = () => useContext(ZakatContext);
