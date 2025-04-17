const express = require("express");
const campaignController = require("./controller");
const { nationalCampaignCreateValidator } = require("./validator");
const { validateRequest } = require("./validateRequest");
const authMiddleware = require("../../../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/national-blood-campaign",
  authMiddleware,
  nationalCampaignCreateValidator,
  validateRequest,
  campaignController.createCampaign
);

router.get("/national-blood-campaign/user",authMiddleware, campaignController.getCampaignsByUser);

router.get("/national-blood-campaign/", campaignController.getAllCampaigns);

router.get("/national-blood-campaign/:id", campaignController.getCampaignById);

module.exports = router;
