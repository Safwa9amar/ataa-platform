// src/routes/loggedDeviceRouter.js

const express = require("express");
const loggedDeviceController = require("../controllers/loggedDeviceController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Route to create a logged device
router.post(
  "/devices/",
  authenticate,
  loggedDeviceController.createLoggedDevice
);

// Route to get all logged devices for a specific user
router.get("/devices", authenticate, loggedDeviceController.getLoggedDevices);

// Route to update the last login time for a device
router.put(
  "/devices/:deviceId/last-login",
  authenticate,
  loggedDeviceController.updateLastLogin
);

module.exports = router;
