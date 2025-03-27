// routes/invoiceRouter.js
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const authenticate = require("../middlewares/authMiddleware");

// إضافة فاتورة جديدة
router.post("/expense", authenticate, expenseController.addExpense);

// جلب جميع الفواتير
router.get("/expense", authenticate, expenseController.getAllExpenses);

// جلب فاتورة محددة
router.get("/expense/:id", authenticate, expenseController.getExpenseById);

// تحديث فاتورة
router.put("/expense/:id", authenticate, expenseController.updateExpense);

// حذف فاتورة
router.delete("/expense/:id", authenticate, expenseController.deleteExpense);

module.exports = router;
