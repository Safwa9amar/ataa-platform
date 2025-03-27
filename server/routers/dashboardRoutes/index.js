const express = require("express");
const router = express.Router();
const charityRouets = require("./charity/index");
const suppliersRoutes = require("./suppliers/index");

const authenticate = require("../../middlewares/authMiddleware");

router.use("/dashboards/charity", authenticate, charityRouets);

router.use("/dashboards/suppliers", authenticate, suppliersRoutes);

module.exports = router;
