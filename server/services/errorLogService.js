// src/services/errorLogService.js
const prisma = require("../models");

/**
 * Get all error logs
 */
async function getAllErrorLogs() {
  return await prisma.errorLog.findMany();
}

/**
 * Get an error log by ID
 * @param {number} id - Error log ID
 */
async function getErrorLogById(id) {
  return await prisma.errorLog.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new error log
 * @param {object} errorLogData - Error log data
 */
async function createErrorLog(errorLogData) {
  return await prisma.errorLog.create({
    data: errorLogData,
  });
}

/**
 * Update an error log by ID
 * @param {number} id - Error log ID
 * @param {object} errorLogData - Error log data
 */
async function updateErrorLog(id, errorLogData) {
  return await prisma.errorLog.update({
    where: { id: parseInt(id, 10) },
    data: errorLogData,
  });
}

/**
 * Delete an error log by ID
 * @param {number} id - Error log ID
 */
async function deleteErrorLog(id) {
  return await prisma.errorLog.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllErrorLogs,
  getErrorLogById,
  createErrorLog,
  updateErrorLog,
  deleteErrorLog,
};
