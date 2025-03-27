const express = require("express");
const notificationController = require("../controllers/notificationController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new notification
router.use("/notifications/", authenticate);

router.post("/notifications/", notificationController.createNotification);

// Get notifications for a user
router.get(
  "/notifications/:userId/:keywords?",
  notificationController.getNotificationsByUserId
);

// Mark all notification as read
router.patch(
  "/notifications/read-all",
  notificationController.markAllNotificationAsRead
);
// Mark a notification as read
router.patch(
  "/notifications/:id/read",
  notificationController.markNotificationAsRead
);

// Delete a notification
router.delete("/notifications/:id", notificationController.deleteNotification);

module.exports = router;
