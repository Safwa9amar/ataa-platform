import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { Platform, ToastAndroid, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_ENDPOINTS from "../config/config";
import { useNavigation } from "@react-navigation/native";
import { assignTopDonorRankToUser } from "../utils/assignTopDonorRank";
import { getCommonHeaders } from "../services/getCommonHeaders";
import { io } from "socket.io-client";
import axios from "axios";

let GoogleSignin;
if (Platform.OS !== "web") {
  GoogleSignin =
    require("@react-native-google-signin/google-signin").GoogleSignin;
}

// Socket connection
const socket = io(process.env.SERVER_URL, {
  reconnectionAttempts: 5,
  transports: ["websocket"],
});

const CredentialsContext = createContext();

export const useCredentials = () => useContext(CredentialsContext);

export const CredentialsProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [saveLogin, setSaveLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  // Initial credentials state

  // Initialize credentials
  useEffect(() => {
    const initializeCredentials = async () => {
      try {
        const [savedLogin, token] = await Promise.all([
          AsyncStorage.getItem("saveLogin"),
          AsyncStorage.getItem(saveLogin ? "token" : "sessionToken"),
        ]);

        console.log(savedLogin, token);

        setSaveLogin(JSON.parse(savedLogin || "false"));

        if (token) {
          setUserToken(token);
          checkAuthentication(token);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setLoading(false);
      }
    };
    if (Platform.OS === "android") {
      GoogleSignin.configure({
        webClientId: process.env.WEB_CLIENT_ID,
      });
    }
    initializeCredentials();
  }, []);

  // Socket management
  useEffect(() => {
    if (!user?.id) return;

    socket.emit("register", { userId: user.id });

    const handleNotification = (notification) => {
      ToastAndroid.showWithGravity(
        `📢 ${notification.title}\n${notification.message}`,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
      checkAuthAfterUpdate();

      // if (notification.link) {
      //   Linking.openURL(notification.link).catch(console.error);
      // }
    };

    socket.on("notification", handleNotification);
    socket.on("subscripe", checkAuthAfterUpdate);

    return () => {
      socket.off("notification", handleNotification);
      socket.off("subscripe", checkAuthAfterUpdate);
    };
  }, [user?.id]);

  const checkAuthAfterUpdate = () => {
    checkAuthentication(userToken);
  };

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
        await handleFailedAuth();
      }
    } catch (error) {
      console.error("Auth check error:", error);
      await handleFailedAuth();
    } finally {
      setLoading(false);
    }
  };

  const handleFailedAuth = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.multiRemove(["token", "sessionToken"]);
    setUserToken(null);
  };

  const login = useCallback(
    async (token) => {
      try {
        const storageKey = saveLogin ? "token" : "sessionToken";
        await AsyncStorage.setItem(storageKey, token);
        setUserToken(token);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    [saveLogin]
  );

  const logout = async () => {
    try {
      setIsLoggedIn(false);
      setUserToken(null);
      setUser({});
      await AsyncStorage.multiRemove(["token", "sessionToken"]);
      navigation.navigate("Login");
      socket.disconnect();
      if (GoogleSignin) {
        const isSignedIn = await GoogleSignin.isSignedIn();
        if (isSignedIn) {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUser = async (updatedData) => {
    console.log(updatedData);

    setLoading(true);
    try {
      const response = await axios.put(
        API_ENDPOINTS.USERS.UPDATE,
        updatedData,
        { headers: getCommonHeaders(userToken, "multipart/form-data") }
      );

      if (response.status === 200) {
        setUser((prev) => ({ ...prev, ...response.data }));
        ToastAndroid.show("Profile updated successfully!", ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error("Update error:", error);
      ToastAndroid.show("Update failed", ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };
  async function getToken(userInfo) {
    setLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
        method: "POST",
        headers: getCommonHeaders(),
        body: JSON.stringify({ token: userInfo.idToken, saveLogin }),
      });
      const data = await res.json();
      console.log(data);

      login(data.token);
      if (data.token) {
        checkAuthentication(data.token);
      }
    } catch (error) {
      console.error("Google login error:", error);
    } finally {
      setLoading(false);
    }
  }
  // Function to handle Google login
  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        await getToken(userInfo);
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };
  const contextValue = {
    isLoggedIn,
    loading,
    user,
    userToken,
    saveLogin,
    setSaveLogin,
    login,
    logout,
    updateUser,
    checkAuthentication,
    loginWithGoogle,
    setLoading,
    checkAuthAfterUpdate,
  };

  return (
    <CredentialsContext.Provider value={contextValue}>
      {children}
    </CredentialsContext.Provider>
  );
};
