// src/routers/fieldRouter.js
const express = require("express");
const router = express.Router();
const fieldController = require("../controllers/fieldController");
const { authenticate } = require("../middlewares/authMiddleware");

// Route to get all fields
router.get("/fields/", fieldController.getAllFields);

// Route to get a field by ID
router.get("/fields/:id", fieldController.getFieldById);

// Route to create a new field
router.post("/fields/", fieldController.createField);

// Route to update a field by ID
router.put("/fields/:id", fieldController.updateField);

// Route to delete a field by ID
router.delete("/fields/:id", fieldController.deleteField);

module.exports = router;
