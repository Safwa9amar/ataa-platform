const express = require("express");
const partnerController = require("../controllers/partnerController");
const authenticate = require("../middlewares/authMiddleware");
const checkAccountTypeAndRole = require("../middlewares/checkAccountTypeAndRole");

const router = express.Router();

// Create a new partner
router.post(
  "/partners/",
  authenticate,
  checkAccountTypeAndRole,
  partnerController.createPartner
);

// Get a partner by ID
router.get("/partners/:id", authenticate, partnerController.getPartnerById);

// Update a partner's details
router.put("/partners/:id", authenticate, partnerController.updatePartner);

// Delete a partner
router.delete("/partners/:id", authenticate, partnerController.deletePartner);

module.exports = router;
