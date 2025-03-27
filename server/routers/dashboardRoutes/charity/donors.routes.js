const express = require("express");
const { donorsController } = require("../../../controllers/dashboards/charity");
const router = express.Router();

// 🔹 تعريف المسارات الخاصة بالمتبرعين
router.get("/donor/kpis", donorsController.getDonationMetrics);
router.get(
  "/donor/average-donation-size",
  donorsController.getAverageDonationSize
);
router.get(
  "/donor/donation-distribution-age",
  donorsController.getDonationDistributionByAge
);
router.get(
  "/donor/donation-distribution-location",
  donorsController.getDonationDistributionByLocation
);
router.get("/donor/donor-growth-rate", donorsController.getDonorGrowthRate);
router.get(
  "/donor/new-vs-returning-donors",
  donorsController.getNewVsReturningDonors
);

module.exports = router;
