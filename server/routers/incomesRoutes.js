const express = require("express");
const incomeController = require("../controllers/incomeController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new Income record
router.post("/incomes", authenticate, incomeController.createIncome);

// Get all Income records (with optional filters)
router.get("/incomes", authenticate, incomeController.getAllIncomes);

// Get Income record by ID
router.get("/incomes/:id", authenticate, incomeController.getIncomeById);

// Update Income record by ID
router.put("/incomes/:id", authenticate, incomeController.updateIncome);

// Delete Income record by ID
router.delete("/incomes/:id", authenticate, incomeController.deleteIncome);

module.exports = router;
