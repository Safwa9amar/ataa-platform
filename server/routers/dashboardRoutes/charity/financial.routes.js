// routes/financialRoutes.js

const express = require("express");
const router = express.Router();
const {
  charityDashboardController,
} = require("../../../controllers/dashboards");

router.get(
  "/financial/kpis-data",
  charityDashboardController.financialController.getKpiData
);
router.get(
  "/financial/monthly-revenue-growth",
  charityDashboardController.financialController.getMonthlyRevenueGrowth
);
router.get(
  "/financial/revenue-vs-expenses",
  charityDashboardController.financialController.getRevenueVsExpenses
);
router.get(
  "/financial/expense-distribution-by-activity",
  charityDashboardController.financialController
    .getExpenseDistributionByActivity
);

module.exports = router;
