const express = require("express");
const router = express.Router();
const donationOpportunityController = require("../controllers/donationOpportunityController");
const authenticate = require("../middlewares/authMiddleware");
const {
  uniqueVisitorMiddlewareForOppertunities,
} = require("../middlewares/uniqueVisitorsMiddleware");
// get doantion opportunities for home

router.get(
  "/donation-opportunities/home",
  donationOpportunityController.getAllDonationOpportunitiesForHome
);

router.get(
  "/donation-opportunities/my",
  authenticate,
  donationOpportunityController.getMyDonationOpportunities
);

// Get all donation opportunities
router.post(
  "/donation-opportunities/:type?/:field?/:category?/",
  donationOpportunityController.getAllDonationOpportunities
);

// Get a specific donation opportunity by ID

// Create a new donation opportunity
router.post(
  "/donation-opportunities-create/",
  authenticate,
  donationOpportunityController.createDonationOpportunity
);

// Update a donation opportunity by ID
router.put(
  "/donation-opportunities/:id",
  donationOpportunityController.updateDonationOpportunity
);

// Delete a donation opportunity by ID
router.delete(
  "/donation-opportunities/:id",
  donationOpportunityController.deleteDonationOpportunity
);

router.get(
  "/donation-opportunities/:id",
  uniqueVisitorMiddlewareForOppertunities,
  donationOpportunityController.getDonationOpportunityById
);

module.exports = router;
