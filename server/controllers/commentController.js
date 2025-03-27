const commentService = require("../services/commentService");

// Get all comments for a specific charity
exports.getAllCommentsByCharityId = async (req, res) => {
  const { charityId } = req.params;
  try {
    const comments = await commentService.getAllCommentsByCharityId(charityId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific comment by ID
exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await commentService.getCommentById(id);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: "Comment not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new comment
exports.createComment = async (req, res) => {
  try {
    const newComment = await commentService.createComment(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedComment = await commentService.updateComment(id, req.body);
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await commentService.deleteComment(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
