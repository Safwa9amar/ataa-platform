const express = require("express");
const router = express.Router();
const dashboardsController = require("../../../controllers/dashboards/charity/index");

router.get(
  "/account-health/active-programs-distribution",
  dashboardsController.AccountHealth.activeProgramsDistribution
);
router.get(
  "/account-health/ongoing-vs-incomplete-programs",
  dashboardsController.AccountHealth.ongoingVsIncompletePrograms
);
router.get(
  "/account-health/donor-growth-over-time",
  dashboardsController.AccountHealth.donorGrowthOverTime
);
router.get(
  "/account-health/programs-engagement-comparison",
  dashboardsController.AccountHealth.programsEngagementComparison
);
router.get(
  "/account-health/kpi-metrics",
  dashboardsController.AccountHealth.kpiMetrics
);

module.exports = router;
