const prisma = require("../models");

// Service to create a new notification
const createNotification = async (data) => {
  const notification = await prisma.notification.create({ data });

  return notification;
};

// Service to fetch all notifications for a user
const getNotificationsByUserId = async (userId, keywords = "") => {
  return await prisma.notification.findMany({
    where: {
      userId,
      OR: keywords
        ? [
            { title: { contains: keywords } },
            { message: { contains: keywords } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Service to mark a notification as read
const markNotificationAsRead = async (id) => {
  return await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
};
// Service to mark a notification as read
const markAllNotificationAsRead = async (id) => {
  return await prisma.notification.updateMany({
    where: {
      userId: id,
    },
    data: { read: true },
  });
};

// Service to delete a notification
const deleteNotification = async (id) => {
  return await prisma.notification.delete({ where: { id } });
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationAsRead,
};
