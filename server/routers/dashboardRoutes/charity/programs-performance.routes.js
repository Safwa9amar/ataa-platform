const express = require("express");
const {
  charityDashboardController,
} = require("../../../controllers/dashboards");
const router = express.Router();

router.get(
  "/programs-performance/distribution-donations-program-period",
  charityDashboardController.programsPerformance
    .distributionDonationsProgramPeriod
);
router.get(
  "/programs-performance/distribution-of-donations",
  charityDashboardController.programsPerformance.distributionOfDonations
);
router.get(
  "/programs-performance/kpis",
  charityDashboardController.programsPerformance.getKpisData
);
router.get(
  "/programs-performance/donor-interactions",
  charityDashboardController.programsPerformance.donorInteractions
);
router.get(
  "/programs-performance/monthly-program-performance/:programId",
  charityDashboardController.programsPerformance.monthlyProgramPerformance
);
module.exports = router;
