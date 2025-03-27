const express = require("express");
const financialController = require("../../../controllers/dashboards/suppliers/index");
const router = express.Router();

// مسار إجمالي الإيرادات

router.get(
  "/financial-performance/kpis",
  financialController.financialPerformance.getKpis
);
router.get(
  "/financial-performance/total-revenue-over-time",
  financialController.financialPerformance.getTotalRevenueOverTime
);

// مسار الإيرادات حسب المنتج
router.get(
  "/financial-performance/revenue-by-product",
  financialController.financialPerformance.getRevenueByProduct
);

// مسار الإيرادات حسب الفئة
router.get(
  "/financial-performance/revenue-by-category",
  financialController.financialPerformance.getRevenueByCategory
);

module.exports = router;
