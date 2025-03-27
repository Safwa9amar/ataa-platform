// src/routes/rechargeRouter.js

const express = require("express");
const router = express.Router();
const rechargeController = require("../controllers/rechargeController");
const authenticate = require("../middlewares/authMiddleware");
// Routes for recharge operations
router.get(
  "/recharges/:page?/:limit?/:createdAt?",
  authenticate,
  rechargeController.getAllRecharges
);
router.get("/recharges/:id", authenticate, rechargeController.getRechargeById);
router.post("/recharges/", authenticate, rechargeController.createRecharge);
router.put("/recharges/:id", authenticate, rechargeController.updateRecharge);
router.delete(
  "/recharges/:id",
  authenticate,
  rechargeController.deleteRecharge
);

module.exports = router;
