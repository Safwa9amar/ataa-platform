// src/routers/paymentRoutes.js
const express = require("express");
const router = express.Router();
const progressController = require("../controllers/progressController");
const { verifySignature } = require("@chargily/chargily-pay");
const bodyParser = require("body-parser");

const API_SECRET_KEY = "test_sk_9Ap4PSqXHHo6Y81Ac1bSUbpUGHWyxl4BIB3NKIzt";
// Middleware to capture raw body as Buffer
router.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

router.post("/payment/chargily", (req, res) => {
  const signature = req.get("signature") || "";
  const payload = req.rawBody;

  if (!signature) {
    console.log("Signature header is missing");
    res.sendStatus(400);
    return;
  }

  try {
    if (!verifySignature(payload, signature, API_SECRET_KEY)) {
      console.log("Signature is invalid");
      res.sendStatus(403);
      return;
    }
  } catch (error) {
    console.log(
      "Something happened while trying to process the request to the webhook"
    );
    res.sendStatus(403);
    return;
  }

  const event = req.body;
  // You can use the event.type here to implement your own logic
  console.log(event);

  res.sendStatus(200);
});

module.exports = router;
