import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import API_ENDPOINTS from "../config/apiEndPoints";
import { useCredentials } from "./CredentialsContext";
import { getAllUsers } from "../services/userServices";

const KibarMohsninContext = createContext();

export const KibarMohsninProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [period, setPeriod] = useState(null);
  const { userToken } = useCredentials();
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers(keyword, period, userToken);
      setData(data.filter((user) => user.isVisible));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [keyword, period]);

  return (
    <KibarMohsninContext.Provider
      value={{ data, loading, error, setKeyword, period, setPeriod, fetchData }}
    >
      {children}
    </KibarMohsninContext.Provider>
  );
};

const useKibarMohsnin = () => {
  const context = React.useContext(KibarMohsninContext);
  if (context === undefined) {
    throw new Error(
      "useKibarMohsnin must be used within a KibarMohsninProvider"
    );
  }
  return context;
};

export { useKibarMohsnin };
