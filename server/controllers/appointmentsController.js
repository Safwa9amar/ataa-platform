// appointmentsController.js
const firebaseAdmin = require("../firebase");
const prisma = require("../models");

const appointmentService = require("../services/appointmentsService");

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};
// Get appointment by campaign ID
const getAppointmentsByCampaignId = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentsByCampaignId(
      id
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};
// Get national campaign appointments
const getNationalCampaignAppointments = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment =
      await appointmentService.getNationalCampaignAppointments(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};
//  Get appointment by user ID
const getAppointmentByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentByUserId(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment" });
  }
};
// Create a new appointment
const createAppointment = async (req, res) => {
  const io = req.app.get("io"); // Retrieve io instance from the app object

  try {
    const data = req.body;

    // Create the appointment and notification
    const { appointment, notification } =
      await appointmentService.createAppointment(data, req.user.id);
    const toUser = await prisma.users.findUnique({
      where: {
        id: notification.userId,
      },
      include: {
        fcmTokens: true,
      },
    });
    console.log(toUser);

    // Emit notification only to the specific user's socket
    io.to(`user:${toUser.id}`).emit("notification", notification);
    try {
      await firebaseAdmin.messaging().sendEachForMulticast({
        tokens: toUser.fcmTokens.map((el) => el.token), // Send to multiple devices
        notification: {
          title: notification.title,
          body: notification.message,
        },
      });
    } catch (error) {
      console.log("firebase token error", error.message);
    }

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an appointment
const setAppointmentIsDone = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAppointment = await appointmentService.setAppointmentIsDone(
      id
    );
    // Emit notification only to the specific user's socket
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};
// Update an appointment date
const setAppointmentDate = async (req, res) => {
  const io = req.app.get("io"); // Retrieve io instance from the app object

  try {
    const { id } = req.params;
    const data = req.body;
    const { updatedAppointment, notification } =
      await appointmentService.setAppointmentDate(id, data);
    // Emit notification only to the specific user's socket
    const toUser = await prisma.users.findUnique({
      where: {
        id: notification.userId,
      },
      include: {
        fcmTokens: true,
      },
    });
    io.to(`user:${toUser.id}`).emit("notification", notification);
    try {
      await firebaseAdmin.messaging().sendEachForMulticast({
        tokens: toUser.fcmTokens.map((el) => el.token), // Send to multiple devices
        notification: {
          title: notification.title,
          body: notification.message,
        },
      });
    } catch (error) {
      console.log("error while push firebase notifications to the user");
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    await appointmentService.deleteAppointment(id);
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

module.exports = {
  setAppointmentIsDone,
  getAllAppointments,
  getAppointmentById,
  getAppointmentByUserId,
  getAppointmentsByCampaignId,
  getNationalCampaignAppointments,
  createAppointment,
  setAppointmentDate,
  deleteAppointment,
};
