// src/services/incomeService.js
const prisma = require("../models");

/**
 * Get all incomes with optional filters
 * @param {object} filters - Optional filters (e.g., { userId: '123', startDate: '2024-01-01' })
 */
async function getAllIncomes(filters = {}) {
  const { userId, startDate, endDate, source } = filters;

  return await prisma.income.findMany({
    where: {
      ...(userId && {
        charity: {
          User: {
            id: userId,
          },
        },
      }),
      ...(source && { source }),
      ...(startDate &&
        endDate && {
          receiptDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    },
    orderBy: {
      receiptDate: "desc",
    },
  });
}

/**
 * Get an income record by ID
 * @param {string} id - Income ID
 */
async function getIncomeById(id) {
  return await prisma.income.findUnique({
    where: { id },
  });
}

/**
 * Create a new income record
 * @param {object} incomeData - Income data
 */
async function createIncome(incomeData) {
  const user = await prisma.users.findUnique({
    where: {
      id: incomeData.userId,
    },
  });
  delete incomeData.userId;
  return await prisma.income.create({
    data: {
      ...incomeData,
      charity: {
        connect: {
          id: user.charityId,
        },
      },
      amount: incomeData.amount,
      receiptDate: new Date(incomeData.receiptDate),
    },
  });
}

/**
 * Update an income record by ID
 * @param {string} id - Income ID
 * @param {object} incomeData - Income data
 */
async function updateIncome(id, incomeData) {
  return await prisma.income.update({
    where: { id },
    data: {
      ...incomeData,
      ...(incomeData.amount && { amount: incomeData.amount }),
      ...(incomeData.receiptDate && {
        receiptDate: new Date(incomeData.receiptDate),
      }),
    },
  });
}

/**
 * Delete an income record by ID
 * @param {string} id - Income ID
 */
async function deleteIncome(id) {
  return await prisma.income.delete({
    where: { id },
  });
}

module.exports = {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
};
