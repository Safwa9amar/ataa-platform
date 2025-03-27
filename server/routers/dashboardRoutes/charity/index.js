const express = require("express");
const router = express.Router();
const programsPerformance = require("./programs-performance.routes");
const accountHealth = require("./account-health.routes");
const donors = require("./donors.routes");
const financial = require("./financial.routes");
const executiveSummary = require("./executive-summary.routes");
const confirmMyorder = require("./confirmOrderReceipt");

router.use(accountHealth);
router.use(donors);
router.use(financial);
router.use(executiveSummary);
router.use(programsPerformance);
router.use(confirmMyorder);

module.exports = router;
