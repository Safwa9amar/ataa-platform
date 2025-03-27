import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationAsRead,
} from "../services/notificationServices"; // Update path if necessary
import { useCredentials } from "./CredentialsContext";
import { io } from "socket.io-client";
// Socket connection
const socket = io(process.env.SERVER_URL, {
  reconnectionAttempts: 5,
  transports: ["websocket"],
});

// Notification actions
const notificationActions = {
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  MARK_AS_READ: "MARK_AS_READ",
  UPDATE_NOTIFICATION: "UPDATE_NOTIFICATION",
  SET_LOADING: "SET_LOADING",
  MARK_ALL_AS_READ: "MARK_ALL_AS_READ",
};

// Initial state
const initialState = {
  notifications: [],
  loading: true,
  error: null,
  keywords: "",
};

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case notificationActions.SET_LOADING:
      return { ...state, loading: action.payload };
    case notificationActions.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case notificationActions.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case notificationActions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false,
      };
    case notificationActions.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    case notificationActions.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      };
    case notificationActions.UPDATE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload.id
            ? { ...notification, ...action.payload.updates }
            : notification
        ),
      };
    default:
      return state;
  }
};

// Context
const NotificationContext = createContext();

// Provider
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user, userToken, checkAuthAfterUpdate } = useCredentials();
  const userId = user.id;
  // Fetch notifications for the user on component mount
  const fetchNotifications = async (keywords = "") => {
    dispatch({ type: notificationActions.SET_NOTIFICATIONS, payload: [] }); // Reset notifications
    dispatch({ type: notificationActions.SET_LOADING, payload: true }); // Reset notifications
    try {
      const notifications = await getNotificationsByUserId(
        userId,
        keywords,
        userToken
      );
      dispatch({
        type: notificationActions.SET_NOTIFICATIONS,
        payload: notifications,
      });
    } catch (error) {
      console.error(error.message);
    } finally {
      dispatch({ type: notificationActions.SET_LOADING, payload: false }); // Reset notifications
    }
  };
  useEffect(() => {
    if (userId && userToken) {
      fetchNotifications();
    }
  }, [userId, userToken]);

  useEffect(() => {
    socket.emit("register", { userId: user.id });

    socket.on("notification", (notification) => {
      fetchNotifications();
    });
  }, [user]);
  // Action creators
  const addNotification = async (notificationData) => {
    try {
      const newNotification = await createNotification(
        notificationData,
        userToken
      );
      dispatch({
        type: notificationActions.ADD_NOTIFICATION,
        payload: newNotification,
      });
    } catch (error) {
      console.error("Failed to add notification:", error.message);
    }
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id, userToken);
      checkAuthAfterUpdate();
      dispatch({ type: notificationActions.REMOVE_NOTIFICATION, payload: id });
    } catch (error) {
      console.error("Failed to remove notification:", error.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, userToken);
      checkAuthAfterUpdate();
      dispatch({ type: notificationActions.MARK_AS_READ, payload: id });
    } catch (error) {
      console.error("Failed to mark notification as read:", error.message);
    }
  };
  const markAllAsRead = async () => {
    dispatch({
      type: notificationActions.MARK_ALL_AS_READ,
      payload: [],
    });
    try {
      await markAllNotificationAsRead(userToken);
      checkAuthAfterUpdate();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error.message);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        loading: state.loading,
        error: state.error,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook for using the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
