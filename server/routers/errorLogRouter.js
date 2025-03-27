// src/routers/errorLogRouter.js
const express = require("express");
const router = express.Router();
const errorLogController = require("../controllers/errorLogController");

// Define routes
router.get("/errorLogs/", errorLogController.getAllErrorLogs);
router.get("/errorLogs/:id", errorLogController.getErrorLogById);
router.post("/errorLogs/", errorLogController.createErrorLog);
router.put("/errorLogs/:id", errorLogController.updateErrorLog);
router.delete("/errorLogs/:id", errorLogController.deleteErrorLog);

module.exports = router;
