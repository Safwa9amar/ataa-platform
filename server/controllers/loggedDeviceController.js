// src/controllers/loggedDeviceController.js
const loggedDeviceService = require("../services/loggedDeviceService");
// Controller function to create a logged device
const createLoggedDevice = async (req, res) => {
  const { userId, device, location } = req.body;

  try {
    const loggedDevice = await loggedDeviceService.createLoggedDevice(
      userId,
      device,
      location
    );
    res.status(201).json({
      message: "Device logged successfully",
      data: loggedDevice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging device",
      error: error.message,
    });
  }
};

// Controller function to get all logged devices for a user
const getLoggedDevices = async (req, res) => {
  const { id } = req.user;

  try {
    const devices = await loggedDeviceService.getLoggedDevicesByUser(id);
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching logged devices",
      error: error.message,
    });
  }
};

// Controller function to update the last login time for a device
const updateLastLogin = async (req, res) => {
  const { deviceId } = req.params;

  try {
    const updatedDevice = await loggedDeviceService.updateLastLogin(
      parseInt(deviceId, 10)
    );
    res.status(200).json({
      message: "Last login updated successfully",
      data: updatedDevice,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating last login",
      error: error.message,
    });
  }
};
module.exports = {
  createLoggedDevice,
  getLoggedDevices,
  updateLastLogin,
};
