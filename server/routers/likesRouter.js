// src/routes/index.js
const express = require("express");
const router = express.Router();
const {
  addLike,
  fetchLikesByCharity,
  removeLike,
} = require("../controllers/likeController");
const authenticate = require("../middlewares/authMiddleware");

// Route to get all likes for a charity
router.get("/likes/:charityId", fetchLikesByCharity);

// Route to add a like
router.post("/likes/:charityId", authenticate, addLike);

// Route to delete a like
router.delete("/likes/:id", authenticate, removeLike);

module.exports = router;
