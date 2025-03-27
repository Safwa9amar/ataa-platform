// services/expenseService.js
const prisma = require("../models");

/**
 * Create a new expense record
 * @param {object} expenseData - Expense data to create
 */
exports.createExpense = async (expenseData) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id: expenseData.userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    delete expenseData.userId; // Remove userId from data to avoid conflicts

    return await prisma.expense.create({
      data: {
        ...expenseData,
        charity: {
          connect: {
            id: user.charityId, // Link expense to the user's charity
          },
        },
        amount: parseFloat(expenseData.amount), // Ensure amount is a number
        paymentDate: new Date(expenseData.paymentDate), // Convert to Date object
      },
    });
  } catch (error) {
    throw new Error(`Failed to create expense: ${error.message}`);
  }
};

/**
 * Get all expenses with optional filters
 * @param {object} filters - Optional filters (e.g., { userId: '123', startDate: '2024-01-01' })
 */
exports.getExpenses = async (filters = {}) => {
  try {
    const { userId, startDate, endDate, expenseType } = filters;

    return await prisma.expense.findMany({
      where: {
        ...(userId && {
          charity: {
            User: {
              id: userId,
            },
          },
        }),
        ...(expenseType && { expenseType }),
        ...(startDate &&
          endDate && {
            paymentDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      },
      orderBy: {
        paymentDate: "desc",
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch expenses: ${error.message}`);
  }
};

/**
 * Get a specific expense by ID
 * @param {string} id - Expense ID
 */
exports.getExpenseById = async (id) => {
  try {
    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new Error("Expense not found");
    }

    return expense;
  } catch (error) {
    throw new Error(`Failed to fetch expense: ${error.message}`);
  }
};

/**
 * Update an expense record by ID
 * @param {string} id - Expense ID
 * @param {object} data - Updated expense data
 */
exports.updateExpense = async (id, data) => {
  try {
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        ...data,
        ...(data.amount && { amount: parseFloat(data.amount) }),
        ...(data.paymentDate && { paymentDate: new Date(data.paymentDate) }),
      },
    });

    return updatedExpense;
  } catch (error) {
    throw new Error(`Failed to update expense: ${error.message}`);
  }
};

/**
 * Delete an expense record by ID
 * @param {string} id - Expense ID
 */
exports.deleteExpense = async (id) => {
  try {
    const deletedExpense = await prisma.expense.delete({
      where: { id },
    });

    return deletedExpense;
  } catch (error) {
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
};
