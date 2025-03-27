const express = require("express");
const router = express.Router();
const fastDonationController = require("../controllers/fastDonationController");

router.get(
  "/fast-donation/chargily/:field/:amount",
  fastDonationController.chargily
);
router.get(
  "/fast-donation/stripe/:field/:amount",
  fastDonationController.stripe
);

router.post("/fast-donation/baridimob", fastDonationController.baridimob);

module.exports = router;
