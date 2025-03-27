const express = require("express");
const {
  chargilyWebHookController,
} = require("../controllers/chargilyWebHookController");
const router = express.Router();

router.post("/chargily-webhook", chargilyWebHookController);

module.exports = router;
