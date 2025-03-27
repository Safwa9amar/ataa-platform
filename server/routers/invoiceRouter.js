// routes/invoiceRouter.js
const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authenticate = require("../middlewares/authMiddleware");

// إضافة فاتورة جديدة
router.post("/invoice", authenticate, invoiceController.addInvoice);

// جلب جميع الفواتير
router.get("/invoice", authenticate, invoiceController.getAllInvoices);

// جلب فاتورة محددة
router.get("/invoice/:id", authenticate, invoiceController.getInvoiceById);

// تحديث فاتورة
router.put("/invoice/:id", authenticate, invoiceController.updateInvoice);

// حذف فاتورة
router.delete("/invoice/:id", authenticate, invoiceController.deleteInvoice);

module.exports = router;
