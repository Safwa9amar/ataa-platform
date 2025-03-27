const notificationService = require("../services/notificationService");

// Store the `io` instance globally
// Create a new notification
const createNotification = async (req, res) => {
  const { title, message, link, userId } = req.body;

  try {
    const notification = await notificationService.createNotification({
      title,
      message,
      link,
      userId,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

// Get all notifications for a user
const getNotificationsByUserId = async (req, res) => {
  const { id } = req.user;
  const { keywords } = req.query;

  try {
    const notifications = await notificationService.getNotificationsByUserId(
      id,
      keywords
    );
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedNotification =
      await notificationService.markNotificationAsRead(id);
    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ error: "Failed to update notification status" });
  }
};
// Mark a notification as read
const markAllNotificationAsRead = async (req, res) => {
  const userId = req.user.id;

  try {
    const updatedNotification =
      await notificationService.markAllNotificationAsRead(userId);
    res.status(200).json(updatedNotification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update notification status" });
  }
};

// Delete a notification
const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    await notificationService.deleteNotification(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification" });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationAsRead,
};
