// src/services/currentBalanceUsesService.js
const prisma = require("../models");

/**
 * Get all current balance uses
 */
async function getAllCurrentBalanceUses() {
  return await prisma.currentBalanceUses.findMany();
}

/**
 * Get a current balance use by ID
 * @param {number} id - Current balance use ID
 */
async function getCurrentBalanceUseById(id) {
  return await prisma.currentBalanceUses.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new current balance use
 * @param {object} currentBalanceUsesData - Current balance use data
 */
async function createCurrentBalanceUse(currentBalanceUsesData) {
  return await prisma.currentBalanceUses.create({
    data: currentBalanceUsesData,
  });
}

/**
 * Update a current balance use by ID
 * @param {number} id - Current balance use ID
 * @param {object} currentBalanceUsesData - Current balance use data
 */
async function updateCurrentBalanceUse(id, currentBalanceUsesData) {
  return await prisma.currentBalanceUses.update({
    where: { id: parseInt(id, 10) },
    data: currentBalanceUsesData,
  });
}

/**
 * Delete a current balance use by ID
 * @param {number} id - Current balance use ID
 */
async function deleteCurrentBalanceUse(id) {
  return await prisma.currentBalanceUses.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllCurrentBalanceUses,
  getCurrentBalanceUseById,
  createCurrentBalanceUse,
  updateCurrentBalanceUse,
  deleteCurrentBalanceUse,
};
