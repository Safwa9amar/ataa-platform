const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statisticsController");

// Route to fetch donation statistics
router.get("/statistics", statisticsController.getStatistics);

module.exports = router;
