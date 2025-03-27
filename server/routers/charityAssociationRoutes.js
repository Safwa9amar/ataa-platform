const express = require("express");
const router = express.Router();
const charityAssociationController = require("../controllers/charityAssociationController");

// Get all charity associations
router.get(
  "/charityAssociations",
  charityAssociationController.getAllCharityAssociations
);

// Get a specific charity association by ID
router.get(
  "/charityAssociations/:id",
  charityAssociationController.getCharityAssociationById
);

// Create a new charity association
router.post(
  "/charityAssociations",
  charityAssociationController.createCharityAssociation
);

// Update a charity association by ID
router.put(
  "/charityAssociations/:id",
  charityAssociationController.updateCharityAssociation
);

// Delete a charity association by ID
router.delete(
  "/charityAssociations/:id",
  charityAssociationController.deleteCharityAssociation
);

module.exports = router;
