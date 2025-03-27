const charityService = require("../services/charityService");

/**
 * Get all charities
 */
const getAllCharities = async (req, res) => {
  try {
    const charities = await charityService.getAllCharities(req.query);
    res.json(charities);
  } catch (error) {
    res.status(500).json({ message: "Error fetching charities", error });
  }
};

/**
 * search for chrities
 */
const searchChrities = async (req, res) => {
  try {
    const { wilaya, keywords = "" } = req.query;

    const charity = await charityService.searchChrities(wilaya, keywords);
    if (!charity) {
      return res.status(404).json({ message: "No charities founds" });
    }
    res.json(charity);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching charities", error });
  }
};

/**
 * Get a single charity by ID
 */
const getCharityById = async (req, res) => {
  try {
    const { id } = req.params;
    const charity = await charityService.getCharityById(id);
    if (!charity) {
      return res.status(404).json({ message: "Charity not found" });
    }
    res.json(charity);
  } catch (error) {
    res.status(500).json({ message: "Error fetching charity", error });
  }
};

/**
 * Create a new charity linked to a user
 */
const createCharity = async (req, res) => {
  try {
    const charity = await charityService.createCharity(req.body, req.user.id);
    res.status(201).json(charity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating charity", error });
  }
};

/**
 * Update a charity by ID
 */
const updateCharity = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCharity = await charityService.updateCharity(id, req.body);
    res.json(updatedCharity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating charity", error });
  }
};

/**
 * Delete a charity by ID
 */
const deleteCharity = async (req, res) => {
  try {
    const { id } = req.params;
    await charityService.deleteCharity(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting charity", error });
  }
};

module.exports = {
  getAllCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
  searchChrities,
};
