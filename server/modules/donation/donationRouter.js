// routes/donationRouter.js
const express = require("express");
const router = express.Router();
const donationController = require("./donationController");
const createDonation = require("./create/controller");

// Create a new donation
router.post("/donation/", createDonation);

// Get all donation
router.get("/donation/", donationController.getDonations);

// Get a specific donation by ID
router.get("/donation/:id", donationController.getDonationById);

// Update a donation by ID
router.put("/donation/:id", donationController.updateDonation);

// Delete a donation by ID
router.delete("/donation/:id", donationController.deleteDonation);

module.exports = router;
