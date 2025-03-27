const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authenticate } = require("../middlewares/authMiddleware");
// Get all comments for a specific charity by charityId
router.get(
  "/comments/charity/:charityId",
  commentController.getAllCommentsByCharityId
);

// Get a specific comments by ID
router.get("/comments/:id", commentController.getCommentById);

// Create a new comments
router.post("/comments/", commentController.createComment);

// Update a comments by ID
router.put("/comments/:id", commentController.updateComment);

// Delete a comments by ID
router.delete("/comments/:id", commentController.deleteComment);

module.exports = router;
