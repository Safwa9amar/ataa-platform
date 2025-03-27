const express = require("express");
const router = express.Router();
// Import route modules
const loginRoute = require("./loginRoute");
const signupRoute = require("./signupRoute");
const verifySignUpRoute = require("./verifySignUpRoute");
const forgotPasswordRoute = require("./forgotPasswordRoute");
const resetPasswordRoute = require("./resetPasswordRoute");
const googleAuth = require("./google");

// Use route modules
router.use("/auth", loginRoute);
router.use("/auth", signupRoute);
router.use("/auth", verifySignUpRoute);
router.use("/auth", forgotPasswordRoute);
router.use("/auth", resetPasswordRoute);
router.use("/auth", googleAuth);

module.exports = router;
