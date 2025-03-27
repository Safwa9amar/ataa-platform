import Cookies from "js-cookie";
import { useState, useCallback } from "react";

const useCookies = () => {
  const getCookie = useCallback((key) => {
    const value = Cookies.get(key);
    return value ? JSON.parse(value) : null;
  }, []);

  const setCookie = useCallback((key, value, options = {}) => {
    Cookies.set(key, JSON.stringify(value), options);
  }, []);

  const removeCookie = useCallback((key) => {
    Cookies.remove(key);
  }, []);

  return { getCookie, setCookie, removeCookie };
};

export default useCookies;
