// routes/charityCampaignRoutes.js
const express = require("express");
const controller = require("../controllers/HomeCarouselController");
const authenticate = require("../middlewares/authMiddleware");
const router = express.Router();

// Routes
router.get("/home-carousel", controller.getAllHomeCarouselDataController); // Get all charity campaigns
router.post(
  "/home-carousel",
  authenticate,
  controller.createHomeCarouselDataController
); // Create a new charity campaign
router.put(
  "/home-carousel/:id",
  authenticate,
  controller.updateHomeCarouselDataController
); // Update a charity campaign by ID
router.delete(
  "/home-carousel/:id",
  authenticate,
  controller.deleteHomeCarouselDataController
); // Delete a charity campaign by ID

module.exports = router;
