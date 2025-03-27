import { useState, useEffect } from "react";
import { useCredentials } from "../context/CredentialsContext";

const useFetch = (url, options = {}, immediate = true) => {
  const { userToken } = useCredentials(); // Get the token from context
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        ...(userToken && { Authorization: `${userToken}` }), // Include the token in headers
        ...options.headers,
      };

      const response = await fetch(url, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, fetchData };
};

export default useFetch;
