const express = require("express");
const router = express.Router();
const supplierssController = require("../../../controllers/dashboards/suppliers/index");

router.get(
  "/inventory-management/kpis",
  supplierssController.inventoryManagement.kpis
);

router.get(
  "/inventory-management/inventory-by-product",
  supplierssController.inventoryManagement.inventoryByProduct
);

router.get(
  "/inventory-management/inventory-by-category",
  supplierssController.inventoryManagement.inventoryByCategory
);

router.get(
  "/inventory-management/inventory-depletion",
  supplierssController.inventoryManagement.inventoryDepletion
);
module.exports = router;
