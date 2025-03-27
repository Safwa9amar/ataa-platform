// src/controllers/likeController.js

const {
  createLike,
  getLikesByCharity,
  deleteLike,
} = require("../services/likeService");

// Create a new like
async function addLike(req, res) {
  const { charityId } = req.params;
  try {
    const newLike = await createLike(charityId, req.user);
    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all likes for a charity
async function fetchLikesByCharity(req, res) {
  const { charityId } = req.params;

  try {
    const likes = await getLikesByCharity(charityId);
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a like
async function removeLike(req, res) {
  const { id } = req.params;
  console.log("likeId", req.params);

  try {
    const deletedLike = await deleteLike(id);
    res.status(200).json(deletedLike);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addLike,
  fetchLikesByCharity,
  removeLike,
};
