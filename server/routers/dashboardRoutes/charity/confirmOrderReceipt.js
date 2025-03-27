const express = require("express");
const {
  confirmOrderReceiptController,
} = require("../../../controllers/dashboards/charity");
const router = express.Router();

router.get(
  "/confirm-order-receipt",
  confirmOrderReceiptController.confirmInvoice
);

router.get(
  "/confirm-order-receipt/my-invoices",
  confirmOrderReceiptController.getAllInvoices
);

router.get(
  "/confirm-order-receipt/pdf/:id",
  confirmOrderReceiptController.generateInvoicePDF
);
module.exports = router;
