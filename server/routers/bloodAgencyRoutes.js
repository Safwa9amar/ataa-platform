const express = require("express");
const bloodAgencyController = require("../controllers/bloodAgencyController");
const checkAccountTypeAndRole = require("../middlewares/checkAccountTypeAndRole");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new Blood Agency
router.post(
  "/blood-agencies/",
  authenticate,
  checkAccountTypeAndRole,
  bloodAgencyController.createBloodAgency
);

// Get all Blood Agencies
router.get(
  "/blood-agencies/",
  authenticate,
  bloodAgencyController.getAllBloodAgencies
);

// Get Blood Agency by ID
router.get(
  "/blood-agencies/:id",
  authenticate,
  bloodAgencyController.getBloodAgencyById
);

// Update Blood Agency by ID
router.put(
  "/blood-agencies/:id",
  authenticate,
  bloodAgencyController.updateBloodAgency
);

// Delete Blood Agency by ID
router.delete("/:id", authenticate, bloodAgencyController.deleteBloodAgency);

module.exports = router;
