const express = require("express");
const router = express.Router();
const planController = require("../controllers/planController");
const authenticate = require("../middlewares/authMiddleware");
// Routes for managing plans
router.get("/plans/", authenticate, planController.getAllPlans); // Get all plans
router.get("/plans/:id", authenticate, planController.getPlanById); // Get plans by ID

// router.post(
//   "/plans/",
//   authenticate,
//   (req, res) => {
//     return res.status(400).json({ error: "ro7 tal3ab" });
//   },
//   planController.createPlan
// ); // Create new plans
// router.put(
//   "/plans/:id",
//   authenticate,
//   (req, res) => {
//     return res.status(400).json({ error: "ro7 tal3ab" });
//   },
//   planController.updatePlan
// ); // Update plans
// router.delete(
//   "/plans/:id",
//   authenticate,
//   (req, res) => {
//     return res.status(400).json({ error: "ro7 tal3ab" });
//   },
//   planController.deletePlan
// ); // Delete plan

module.exports = router;
