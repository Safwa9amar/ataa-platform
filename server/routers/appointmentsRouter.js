// appointmentsRouter.js
const express = require("express");
const router = express.Router();
const appointmentsController = require("../controllers/appointmentsController");
const authenticate = require("../middlewares/authMiddleware");
// Get all appointments
router.use("/appointments/", authenticate);

router.get("/appointments/", appointmentsController.getAllAppointments);

// Get appointment by userID
router.get(
  "/appointments/user/:id",
  appointmentsController.getAppointmentByUserId
);
// Get appointment by ID
router.get("/appointments/:id", appointmentsController.getAppointmentById);
// get appointment by campaign ID
router.get(
  "/appointments/campaign/:id",
  appointmentsController.getAppointmentsByCampaignId
);
// get national campaign appointments
router.get(
  "/appointments/national-campaign/:id",
  appointmentsController.getNationalCampaignAppointments
);
// Create a new appointment
router.post("/appointments/", appointmentsController.createAppointment);

// Update an appointment
router.put(
  "/appointments/setDate/:id",
  appointmentsController.setAppointmentDate
);
// Update an appointment
router.put(
  "/appointments/setIsDone/:id",
  appointmentsController.setAppointmentIsDone
);

// Delete an appointment
router.delete("/appointments/:id", appointmentsController.deleteAppointment);

module.exports = router;
