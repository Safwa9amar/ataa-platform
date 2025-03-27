const express = require("express");
const router = express.Router();
const inventoryManagement = require("./inventory-management");
const financialPerformance = require("./financial-performance");
const invoice = require("./invoices");
router.use(inventoryManagement);
router.use(financialPerformance);
router.use(invoice);

module.exports = router;
