"use client";
import React from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { useNotifications } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { GrNotification } from "react-icons/gr";

const NotificationDropdown = ({ isScrolled, isHomePage }) => {
  const { notifications, markAsRead } = useNotifications();
  const router = useRouter();
  const [openNotificationMenu, setOpenNotificationMenu] = React.useState(false);

  return (
    <Menu open={openNotificationMenu} handler={setOpenNotificationMenu}>
      <MenuHandler>
        <IconButton
          variant="text"
          className="m-0 p-0 relative hover:bg-blue-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
        >
          {notifications.filter((n) => !n.read).length > 0 && (
            <span className="absolute -top-2 -right-2 text-white w-5 h-5 text-xs flex justify-center items-center text-center bg-red-600 rounded-full p-2">
              {notifications.filter((n) => !n.read).length || 0}
            </span>
          )}
          <GrNotification
            className={`${
              isHomePage && !isScrolled ? "stroke-white" : "stroke-teal-700"
            } text-secondaryColor cursor-pointer transition-colors duration-300`}
            size={25}
          />
        </IconButton>
      </MenuHandler>
      <MenuList
        dir="rtl"
        className="w-80 max-h-96 overflow-y-auto rounded-md shadow-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 notification-scrollbar"
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                if (!notification.read) markAsRead(notification.id);
                if (notification.link) router.push(notification.link);
              }}
              className={`flex flex-col gap-1 p-4 my-2 rounded-md ${
                notification.read
                  ? "bg-gray-200 dark:bg-gray-700 opacity-70"
                  : "bg-blue-50 dark:bg-blue-900"
              } hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200`}
            >
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {notification.title}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {notification.message}
              </span>
            </MenuItem>
          ))
        ) : (
          <MenuItem className="text-center w-full p-4 text-gray-500 dark:text-gray-400">
            لا توجد إشعارات
          </MenuItem>
        )}
      </MenuList>
    </Menu>
  );
};

export default NotificationDropdown;
