// src/routes/repportsRouters.js

const express = require("express");
const router = express.Router();
const repportsController = require("../controllers/repportsController");
const authenticate = require("../middlewares/authMiddleware");

// get zakaat repports
router.get(
  "/repports/zakat/:year/:id?/:from?/:to?",
  authenticate,
  repportsController.getZakatRepport
);
// get donationopportunities repports
router.get(
  "/repports/donation-opportunity/:id/:from?/:to?",
  authenticate,
  repportsController.getDonationOpportunitiesRepports
);
// get campaigns repports
router.get(
  "/repports/campaigns/:id/:from?/:to?",
  authenticate,
  repportsController.getCampaignsRepports
);
// get user balance repports
router.get(
  "/repports/user-balance/:from?/:to?",
  authenticate,
  repportsController.getUserBalanceRepports
);
// get donations rapport
router.get(
  "/repports/donations/:from?/:to?",
  authenticate,
  repportsController.getDonationsRepports
);

module.exports = router;
