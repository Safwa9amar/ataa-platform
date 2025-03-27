const express = require("express");
const NationalCampaignController = require("../controllers/nationalCampaignController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Routes
router.get("/nationalCampaign/", NationalCampaignController.getAll);
router.get("/nationalCampaign/query", NationalCampaignController.getByQuery);
router.get("/nationalCampaign/:id", NationalCampaignController.getById);

router.post(
  "/nationalCampaign/",
  //   authenticate,
  NationalCampaignController.create
);
router.put(
  "/nationalCampaign/:id",
  authenticate,
  NationalCampaignController.update
);
router.delete(
  "/nationalCampaign/:id",
  authenticate,
  NationalCampaignController.delete
);

module.exports = router;
