// incomeController.js
const incomesServices = require("../services/incomesServices");

/**
 * Create a new income record
 */
const createIncome = async (req, res) => {
  try {
    let userId = req.user.id;
    const { source, amount, receiptDate, notes } = req.body;
    // Validate required fields
    if (!source || !amount || !receiptDate || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const incomeData = {
      source,
      amount: parseFloat(amount),
      receiptDate: new Date(receiptDate),
      notes,
      userId,
    };

    const data = await incomesServices.createIncome(incomeData);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all income records with optional filters
 */
const getAllIncomes = async (req, res) => {
  try {
    const filters = {
      userId: req.query.userId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      source: req.query.source,
    };

    const incomes = await incomesServices.getAllIncomes(filters);
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a specific income record by ID
 */
const getIncomeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Income ID is required" });
    }

    const income = await incomesServices.getIncomeById(id);

    if (!income) {
      return res.status(404).json({ message: "Income record not found" });
    }

    res.status(200).json(income);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

/**
 * Update an income record by ID
 */
const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, amount, receiptDate, notes } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Income ID is required" });
    }

    const updateData = {
      ...(source && { source }),
      ...(amount && { amount: parseFloat(amount) }),
      ...(receiptDate && { receiptDate: new Date(receiptDate) }),
      ...(notes && { notes }),
    };

    const updatedIncome = await incomesServices.updateIncome(id, updateData);

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income record not found" });
    }

    res.status(200).json(updatedIncome);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete an income record by ID
 */
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Income ID is required" });
    }

    const deletedIncome = await incomesServices.deleteIncome(id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income record not found" });
    }

    res.status(200).json({ message: "Income record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIncome,
  getAllIncomes,
  getIncomeById,
  updateIncome,
  deleteIncome,
};
