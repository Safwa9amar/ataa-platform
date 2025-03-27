const express = require("express");
const charityController = require("../controllers/charityController");
const auth = require("../middlewares/authMiddleware");
const checkAccountTypeAndRole = require("../middlewares/checkAccountTypeAndRole");
const { celebrate, Joi } = require("celebrate");
const router = express.Router();

// Get charities by name
router.get(
  "/charities/search",
  // auth,
  celebrate({
    query: Joi.object({
      wilaya: Joi.string().allow("").optional(),
      keywords: Joi.string().allow("").optional(),
    }),
  }),
  charityController.searchChrities
);

// Get all charities
router.get("/charities/", auth, charityController.getAllCharities);

// Get a single charity by ID
router.get("/charities/:id", auth, charityController.getCharityById);



// Create a new charity
router.post(
  "/charities/",
  auth,
  checkAccountTypeAndRole,
  charityController.createCharity
);

// Update a charity by ID
router.put("/charities/:id", auth, charityController.updateCharity);

// Delete a charity by ID
router.delete("/charities/:id", auth, charityController.deleteCharity);

module.exports = router;
