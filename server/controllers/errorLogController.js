// src/controllers/errorLogController.js
const errorLogService = require('../services/errorLogService');

/**
 * Get all error logs
 */
async function getAllErrorLogs(req, res) {
  try {
    const errorLogs = await errorLogService.getAllErrorLogs();
    res.status(200).json(errorLogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching error logs', error });
  }
}

/**
 * Get error log by ID
 */
async function getErrorLogById(req, res) {
  const { id } = req.params;
  try {
    const errorLog = await errorLogService.getErrorLogById(id);
    if (errorLog) {
      res.status(200).json(errorLog);
    } else {
      res.status(404).json({ message: 'Error log not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching error log', error });
  }
}

/**
 * Create a new error log
 */
async function createErrorLog(req, res) {
  const errorLogData = req.body;
  try {
    const newErrorLog = await errorLogService.createErrorLog(errorLogData);
    res.status(201).json(newErrorLog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating error log', error });
  }
}

/**
 * Update an error log
 */
async function updateErrorLog(req, res) {
  const { id } = req.params;
  const errorLogData = req.body;
  try {
    const updatedErrorLog = await errorLogService.updateErrorLog(id, errorLogData);
    res.status(200).json(updatedErrorLog);
  } catch (error) {
    res.status(500).json({ message: 'Error updating error log', error });
  }
}

/**
 * Delete an error log
 */
async function deleteErrorLog(req, res) {
  const { id } = req.params;
  try {
    await errorLogService.deleteErrorLog(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting error log', error });
  }
}

module.exports = {
  getAllErrorLogs,
  getErrorLogById,
  createErrorLog,
  updateErrorLog,
  deleteErrorLog,
};
