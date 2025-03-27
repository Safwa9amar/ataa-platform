// zakatRouter.js
const express = require("express");
const zakatController = require("../controllers/zakatController");
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

router.post("/zakat/", authenticate, zakatController.createZakat); // Create a new zakat record
router.get("/zakat/", authenticate, zakatController.getAllZakat); // Get all zakat records
router.get("/zakat/:id", authenticate, zakatController.getZakatById); // Get a zakat record by ID
router.put("/zakat/:id", authenticate, zakatController.updateZakat); // Update a zakat record by ID
router.delete("/zakat/:id", authenticate, zakatController.deleteZakat); // Delete a zakat record by ID

module.exports = router;
