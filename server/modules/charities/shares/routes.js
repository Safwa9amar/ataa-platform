// src/routes/index.js
const express = require("express");
const router = express.Router();
const {
  addSahre,
  fetchSharesByCharity,
  removeShare,
} = require("../shares/controller");
const authenticate = require("../../../middlewares/authMiddleware");

// Route to get all likes for a charity
router.get("/charity-shares/:charityId", fetchSharesByCharity);

// Route to add a like
router.post("/charity-shares/:charityId", authenticate, addSahre);

// Route to delete a like
router.delete("/charity-shares/:id", authenticate, removeShare);

module.exports = router;
