// src/services/progressService.js
const prisma = require("../models");

/**
 * Get all Progress records
 */
async function getAllProgress() {
  return await prisma.progress.findMany();
}

/**
 * Get a Progress record by ID
 * @param {number} id - Progress ID
 */
async function getProgressById(id) {
  return await prisma.progress.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new Progress record
 * @param {object} progressData - Progress data
 */
async function createProgress(progressData) {
  return await prisma.progress.create({
    data: progressData,
  });
}

/**
 * Update a Progress record by ID
 * @param {number} id - Progress ID
 * @param {object} progressData - Progress data
 */
async function updateProgress(id, progressData) {
  return await prisma.progress.update({
    where: { id: parseInt(id, 10) },
    data: progressData,
  });
}

/**
 * Delete a Progress record by ID
 * @param {number} id - Progress ID
 */
async function deleteProgress(id) {
  return await prisma.progress.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
};
