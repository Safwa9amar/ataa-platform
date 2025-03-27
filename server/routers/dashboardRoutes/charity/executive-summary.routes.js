const express = require("express");
const router = express.Router();
const { executiveSummary } = require("../../../controllers/dashboards/charity");

router.get(
  "/executive-summary/total-donations-over-periods",
  executiveSummary.getTotalDonationsOverPeriods
);
router.get(
  "/executive-summary/donor-retention-rate",
  executiveSummary.getDonorRetentionRate
);
router.get(
  "/executive-summary/donation-growth-rate",
  executiveSummary.getDonationGrowthRate
);
router.get(
  "/executive-summary/number-of-new-donors",
  executiveSummary.getNumberOfNewDonors
);
router.get(
  "/executive-summary/successfully-completed-programs",
  executiveSummary.getSuccessfullyCompletedPrograms
);

router.get(
  "/executive-summary/rate-of-completed-programs",
  executiveSummary.getRateOfCompletedPrograms
);

module.exports = router;
