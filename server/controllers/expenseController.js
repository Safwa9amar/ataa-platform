const expenseService = require("../services/expenseService");

/**
 * Create a new expense record
 */
exports.addExpense = async (req, res) => {
  try {
    let userId = req.user.id;
    const { expenseType, amount, expenseDate, beneficiary, notes } = req.body;

    if (!expenseType || !amount || !expenseDate || !beneficiary || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expenseData = {
      type: expenseType,
      amount: amount,
      paymentDate: new Date(expenseDate),
      recipient: beneficiary,
      notes,
      userId,
    };

    const expense = await expenseService.createExpense(expenseData);
    res.status(201).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all expense records with optional filters
 */
exports.getAllExpenses = async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      type: req.query.type,
    };

    const expenses = await expenseService.getExpenses(filters);
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a specific expense record by ID
 */
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const expense = await expenseService.getExpenseById(id);

    if (!expense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an expense record by ID
 */
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { expenseType, amount, expenseDate, beneficiary, notes } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const updateData = {
      ...(expenseType && { type: expenseType }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(expenseDate && { paymentDate: new Date(expenseDate) }),
      ...(beneficiary && { recipient: beneficiary }),
      ...(notes && { notes }),
    };
    const updatedExpense = await expenseService.updateExpense(id, updateData);

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete an expense record by ID
 */
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const deletedExpense = await expenseService.deleteExpense(id);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense record not found" });
    }

    res.status(200).json({ message: "Expense record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
