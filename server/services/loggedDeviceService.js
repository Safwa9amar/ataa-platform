// src/services/loggedDeviceService.js

const prisma = require("../models");
// Service function to create a new logged device
const createLoggedDevice = async (userId, device, location) => {
  try {
    const loggedDevice = await prisma.loggedDevice.create({
      data: {
        userId,
        device,
        location,
      },
    });
    return loggedDevice;
  } catch (error) {
    throw new Error("Error creating logged device: " + error.message);
  }
};

// Service function to get all devices for a specific user
const getLoggedDevicesByUser = async (userId) => {
  try {
    const devices = await prisma.loggedDevice.findMany({
      where: { userId },
      orderBy: {
        lastLogin: "desc", // Order by last login time
      },
    });
    return devices;
  } catch (error) {
    throw new Error("Error fetching logged devices: " + error.message);
  }
};

// Service function to update the last login time for a device
const updateLastLogin = async (deviceId) => {
  try {
    const updatedDevice = await prisma.loggedDevice.update({
      where: { id: deviceId },
      data: {
        lastLogin: new Date(),
      },
    });
    return updatedDevice;
  } catch (error) {
    throw new Error("Error updating last login: " + error.message);
  }
};

module.exports = {
  createLoggedDevice,
  getLoggedDevicesByUser,
  updateLastLogin,
};
