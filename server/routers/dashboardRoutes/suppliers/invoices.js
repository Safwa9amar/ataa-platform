const express = require("express");
const invoiceController = require("../../../controllers/dashboards/suppliers/index");
const authenticate = require("../../../middlewares/authMiddleware");

const router = express.Router();

// Create a new Supplier Invoice
router.post(
  "/invoices-follow/",
  authenticate,
  invoiceController.invoices.createInvoice
);

// Get all Supplier Invoices
router.get(
  "/invoices-follow/",
  authenticate,
  invoiceController.invoices.getAllInvoices
);

// Get Supplier Invoice by ID
router.get(
  "/invoices-follow/:id",
  authenticate,
  invoiceController.invoices.getInvoiceById
);
// Get Supplier Invoice pdf
router.get(
  "/generate-invoice-pdf/:id",
  authenticate,
  invoiceController.invoices.generateInvoicePDF
);

// Update Supplier Invoice by ID
router.put(
  "/invoices-follow/:id",
  authenticate,
  invoiceController.invoices.updateInvoice
);

// Delete Supplier Invoice by ID
// router.delete(
//   "/invoices-follow/:id",
//   authenticate,
//   invoiceController.invoices.deleteInvoice
// );

// // Add a product to an invoice
// router.post(
//   "/invoices-follow//:id/products",
//   authenticate,
//
//   invoiceController.invoices.addProductToInvoice
// );

// // Remove a product from an invoice
// router.delete(
//   "/invoices-follow//:invoiceId/products/:productId",
//   authenticate,
//
//   invoiceController.invoices.removeProductFromInvoice
// );

// // Update the quantity of a product in an invoice
// router.put(
//   "/invoices-follow//:invoiceId/products/:productId",
//   authenticate,
//
//   invoiceController.invoices.updateProductQuantityInInvoice
// );

// // Change the status of an invoice (e.g., from PENDING to PAID)
// router.put(
//   "/invoices-follow//:id/status",
//   authenticate,
//
//   invoiceController.invoices.updateInvoiceStatus
// );

module.exports = router;
