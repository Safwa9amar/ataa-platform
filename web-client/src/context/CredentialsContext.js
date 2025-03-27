"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import API_ENDPOINTS from "../config/apiEndPoints";
import { assignTopDonorRankToUser } from "../utils/assignTopDonorRank";
import { getCommonHeaders } from "../services/getCommonHeaders";
import { useRouter } from "next/navigation";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Link from "next/link";

// Socket connection
const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  reconnectionAttempts: 5, // Retry on failed connections
});

// Create a credentials context
const CredentialsContext = createContext();

// Custom hook to use the credentials context
export const useCredentials = () => useContext(CredentialsContext);

// Provider component
export const CredentialsProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [saveLogin, setSaveLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const router = useRouter();

  // Initialize credentials on mount
  useEffect(() => {
    const initializeCredentials = async () => {
      const savedLogin = JSON.parse(localStorage.getItem("saveLogin")) || false;
      const sessionToken = sessionStorage.getItem("token");
      const token = savedLogin ? localStorage.getItem("token") : sessionToken;

      setSaveLogin(savedLogin);

      if (token) {
        setUserToken(token);
        // await checkAuthentication(token);
      } else {
        setLoading(false); // Stop loading if no token is found
      }
    };

    initializeCredentials();
  }, []);

  // Watch for changes in `userToken`
  useEffect(() => {
    if (userToken) checkAuthentication(userToken);
  }, [userToken]);

  // Manage socket events
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("register", { userId: user.id });

    const handleNotification = (notification) => {
      toast.info(
        <div dir="rtl">
          <div>
            <strong>📢 إشعار جديد</strong>
          </div>
          <div>{notification.title}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>
            {notification.message || "تفاصيل إضافية غير متوفرة"}
          </div>
          <Link
            href={notification.link || "#"}
            className="bg-secondaryColor text-white text-xs p-2 my-2 font-ElMessiri rounded-full"
          >
            اضغط هنا للمتابعة
          </Link>
        </div>,
        {
          position: "bottom-left",
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
          onClick: () => {
            if (notification.link) router.push(notification.link);
          },
        }
      );
    };

    socket.on("notification", handleNotification);
    socket.on("subscripe", () => {
      checkAuthentication(userToken);
    });
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [user?.id]);

  // Check authentication
  const checkAuthentication = async (token) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.CHECK_AUTH, {
        method: "GET",
        headers: getCommonHeaders(token),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(assignTopDonorRankToUser(data.user));
        login(token);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = useCallback(
    (token) => {
      try {
        if (saveLogin) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
        setUserToken(token);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error saving token:", error);
      }
    },
    [saveLogin]
  );

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUserToken(null);
    setUser({});
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/account/login");
  };

  // Google login function
  const loginWithGoogle = async (userInfo) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
        method: "POST",
        headers: getCommonHeaders(),
        body: JSON.stringify({ token: userInfo.credential, saveLogin }),
      });
      const data = await response.json();

      if (data.token) {
        login(data.token);
        // await checkAuthentication(data.token);
      }
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update user information
  const updateUser = async (updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(
        API_ENDPOINTS.USERS.UPDATE,
        updatedData,
        { headers: getCommonHeaders(userToken, "multipart/form-data") }
      );

      if (response.status === 200) {
        setUser((prevUser) => ({ ...prevUser, ...response.data }));
      } else {
        console.error("Failed to update user data.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Provide context values
  const contextValue = {
    isLoggedIn,
    loading,
    setLoading,
    login,
    logout,
    checkAuthentication,
    user,
    loginWithGoogle,
    userToken,
    saveLogin,
    setSaveLogin,
    updateUser,
  };

  return (
    <CredentialsContext.Provider value={contextValue}>
      {children}
    </CredentialsContext.Provider>
  );
};
