// src/routers/infoSectionRouter.js
const express = require("express");
const router = express.Router();
const infoSectionController = require("../controllers/infoSectionController");

// Define routes
router.get("/info-sections/", infoSectionController.getAllInfoSections);
router.get("/info-sections/:id", infoSectionController.getInfoSectionById);
router.post("/info-sections/", infoSectionController.createInfoSection);
router.put("/info-sections/:id", infoSectionController.updateInfoSection);
router.delete("/info-sections/:id", infoSectionController.deleteInfoSection);

module.exports = router;
