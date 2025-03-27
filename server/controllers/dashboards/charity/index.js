const AccountHealth = require("./account-health.controller");
const programsPerformance = require("./programs-performance.controller");
const executiveSummary = require("./executive-summary.controller");
const financialController = require("./financialController");
const donorsController = require("./donorsController");
const confirmOrderReceiptController = require("./confirmOrderReceipt");

module.exports = {
  AccountHealth,
  programsPerformance,
  executiveSummary,
  financialController,
  donorsController,
  confirmOrderReceiptController,
};
