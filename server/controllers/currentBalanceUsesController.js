// src/controllers/currentBalanceUsesController.js
const currentBalanceUsesService = require('../services/currentBalanceUsesService');

/**
 * Get all current balance uses
 */
async function getAllCurrentBalanceUses(req, res) {
  try {
    const currentBalanceUses = await currentBalanceUsesService.getAllCurrentBalanceUses();
    res.status(200).json(currentBalanceUses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current balance uses', error });
  }
}

/**
 * Get current balance use by ID
 */
async function getCurrentBalanceUseById(req, res) {
  const { id } = req.params;
  try {
    const currentBalanceUse = await currentBalanceUsesService.getCurrentBalanceUseById(id);
    if (currentBalanceUse) {
      res.status(200).json(currentBalanceUse);
    } else {
      res.status(404).json({ message: 'Current balance use not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current balance use', error });
  }
}

/**
 * Create a new current balance use
 */
async function createCurrentBalanceUse(req, res) {
  const currentBalanceUsesData = req.body;
  try {
    const newCurrentBalanceUse = await currentBalanceUsesService.createCurrentBalanceUse(currentBalanceUsesData);
    res.status(201).json(newCurrentBalanceUse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating current balance use', error });
  }
}

/**
 * Update a current balance use
 */
async function updateCurrentBalanceUse(req, res) {
  const { id } = req.params;
  const currentBalanceUsesData = req.body;
  try {
    const updatedCurrentBalanceUse = await currentBalanceUsesService.updateCurrentBalanceUse(id, currentBalanceUsesData);
    res.status(200).json(updatedCurrentBalanceUse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating current balance use', error });
  }
}

/**
 * Delete a current balance use
 */
async function deleteCurrentBalanceUse(req, res) {
  const { id } = req.params;
  try {
    await currentBalanceUsesService.deleteCurrentBalanceUse(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting current balance use', error });
  }
}

module.exports = {
  getAllCurrentBalanceUses,
  getCurrentBalanceUseById,
  createCurrentBalanceUse,
  updateCurrentBalanceUse,
  deleteCurrentBalanceUse,
};
