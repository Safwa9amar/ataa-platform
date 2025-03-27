const express = require("express");
const router = express.Router();
// Import route modules
const updateUserRoute = require("../users/updateUserRoute");
const authMiddleware = require("../../../middlewares/authMiddleware");

// Use route modules
// router.use("/users", authMiddleware, updateUserRoute);

module.exports = router;
