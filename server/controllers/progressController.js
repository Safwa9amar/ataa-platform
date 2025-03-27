// src/controllers/progressController.js
const progressService = require('../services/progressService');

/**
 * Get all Progress records
 */
async function getAllProgress(req, res) {
  try {
    const progress = await progressService.getAllProgress();
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Progress records', error });
  }
}

/**
 * Get Progress record by ID
 */
async function getProgressById(req, res) {
  const { id } = req.params;
  try {
    const progress = await progressService.getProgressById(id);
    if (progress) {
      res.status(200).json(progress);
    } else {
      res.status(404).json({ message: 'Progress not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Progress record', error });
  }
}

/**
 * Create a new Progress record
 */
async function createProgress(req, res) {
  const progressData = req.body;
  try {
    const newProgress = await progressService.createProgress(progressData);
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(500).json({ message: 'Error creating Progress record', error });
  }
}

/**
 * Update a Progress record
 */
async function updateProgress(req, res) {
  const { id } = req.params;
  const progressData = req.body;
  try {
    const updatedProgress = await progressService.updateProgress(id, progressData);
    res.status(200).json(updatedProgress);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Progress record', error });
  }
}

/**
 * Delete a Progress record
 */
async function deleteProgress(req, res) {
  const { id } = req.params;
  try {
    await progressService.deleteProgress(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Progress record', error });
  }
}

module.exports = {
  getAllProgress,
  getProgressById,
  createProgress,
  updateProgress,
  deleteProgress,
};
