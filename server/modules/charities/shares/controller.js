// src/controllers/likeController.js

const {
  createShare,
  deleteShare,
  getSharesByCharity,
} = require("../shares/services");

// Create a new like
async function addSahre(req, res) {
  const { charityId } = req.params;
  try {
    const newShare = await createShare(charityId, req.user);
    res.status(201).json(newShare);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Get all share for a charity
async function fetchSharesByCharity(req, res) {
  const { charityId } = req.params;

  try {
    const share = await getSharesByCharity(charityId);
    res.status(200).json(share);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Delete a like
async function removeShare(req, res) {
  const { id } = req.params;
  console.log("likeId", req.params);

  try {
    const deletedShare = await deleteShare(id);
    res.status(200).json(deletedShare);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  addSahre,
  fetchSharesByCharity,
  removeShare,
};
