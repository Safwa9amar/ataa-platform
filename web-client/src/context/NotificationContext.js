import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
} from "@/services/notificationServices"; // Update path if necessary
import { useCredentials } from "./CredentialsContext";
import { io } from "socket.io-client";
const socket = io(process.env.NEXT_PUBLIC_API_URL);

// Notification actions
const NotificationActions = {
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
  SET_NOTIFICATIONS: "SET_NOTIFICATIONS",
  MARK_AS_READ: "MARK_AS_READ",
  UPDATE_NOTIFICATION: "UPDATE_NOTIFICATION",
};

// Initial state
const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NotificationActions.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case NotificationActions.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case NotificationActions.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: false,
      };
    case NotificationActions.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
    case NotificationActions.UPDATE_NOTIFICATION:
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
  const { user, userToken } = useCredentials();
  const userId = user.id;
  // Fetch notifications for the user on component mount
  const fetchNotifications = async () => {
    try {
      dispatch({ type: NotificationActions.SET_NOTIFICATIONS, payload: [] }); // Reset notifications
      const notifications = await getNotificationsByUserId(userId, userToken);
      dispatch({
        type: NotificationActions.SET_NOTIFICATIONS,
        payload: notifications,
      });
    } catch (error) {
      console.error(error.message);
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
        type: NotificationActions.ADD_NOTIFICATION,
        payload: newNotification,
      });
    } catch (error) {
      console.error("Failed to add notification:", error.message);
    }
  };

  const removeNotification = async (id) => {
    try {
      await deleteNotification(id, userToken);
      dispatch({ type: NotificationActions.REMOVE_NOTIFICATION, payload: id });
    } catch (error) {
      console.error("Failed to remove notification:", error.message);
    }
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, userToken);
      dispatch({ type: NotificationActions.MARK_AS_READ, payload: id });
    } catch (error) {
      console.error("Failed to mark notification as read:", error.message);
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
