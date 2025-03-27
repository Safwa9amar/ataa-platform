// src/controllers/rechargeController.js

const rechargeService = require("../services/rechargeService");

/**
 * Get all recharges
 */
async function getAllRecharges(req, res) {
  const { createdAt, page, limit } = req.params;
  try {
    const recharges = await rechargeService.getAllRecharges(
      createdAt,
      Number(page || 1),
      Number(limit || 10)
    );
    res.status(200).json(recharges);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recharges", error });
  }
}

/**
 * Get a recharge by ID
 */
async function getRechargeById(req, res) {
  const { id } = req.params;
  try {
    const recharge = await rechargeService.getRechargeById(Number(id));
    if (recharge) {
      res.status(200).json(recharge);
    } else {
      res.status(404).json({ message: "Recharge not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching recharge", error });
  }
}

/**
 * Create a new recharge
 */
async function createRecharge(req, res) {
  const rechargeData = req.body;
  try {
    const newRecharge = await rechargeService.createRecharge(rechargeData);
    res.status(201).json(newRecharge);
  } catch (error) {
    res.status(500).json({ message: "Error creating recharge", error });
  }
}

/**
 * Update a recharge
 */
async function updateRecharge(req, res) {
  const { id } = req.params;
  const rechargeData = req.body;
  try {
    const updatedRecharge = await rechargeService.updateRecharge(
      Number(id),
      rechargeData
    );
    res.status(200).json(updatedRecharge);
  } catch (error) {
    res.status(500).json({ message: "Error updating recharge", error });
  }
}

/**
 * Delete a recharge
 */
async function deleteRecharge(req, res) {
  const { id } = req.params;
  try {
    await rechargeService.deleteRecharge(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting recharge", error });
  }
}

module.exports = {
  getAllRecharges,
  getRechargeById,
  createRecharge,
  updateRecharge,
  deleteRecharge,
};
