// routes/donationRouter.js
const express = require('express');
const donationController = require('../controllers/donationController');
const router = express.Router();

// Create a new donation
router.post('/donation/', donationController.createDonation);

// Get all donation
router.get('/donation/', donationController.getDonations);

// Get a specific donation by ID
router.get('/donation/:id', donationController.getDonationById);

// Update a donation by ID
router.put('/donation/:id', donationController.updateDonation);

// Delete a donation by ID
router.delete('/donation/:id', donationController.deleteDonation);

module.exports = router;
