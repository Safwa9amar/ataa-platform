// controllers/charityCampaignController.js
const {
  deleteHomeCarouselData,
  updateHomeCarouselData,
  createHomeCarouselData,
  getAllHomeCarouselData,
} = require("../services/HomeCarouselServices");

// Get all charity campaigns
const getAllHomeCarouselDataController = async (req, res) => {
  try {
    const campaigns = await getAllHomeCarouselData();
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching charity campaigns:", error);
    res.status(500).json({ error: "Failed to fetch charity campaigns." });
  }
};

// Create a new charity campaign
const createHomeCarouselDataController = async (req, res) => {
  try {
    const { title, description, backgroundImage, btnTitle, webLink, appLink } =
      req.body;

    if (
      !title ||
      !description ||
      !backgroundImage ||
      !btnTitle ||
      !webLink ||
      !appLink
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newCampaign = await createHomeCarouselData({
      title,
      description,
      backgroundImage,
      btnTitle,
      webLink,
      appLink,
    });
    res.status(201).json(newCampaign);
  } catch (error) {
    console.error("Error creating charity campaign:", error);
    res.status(500).json({ error: "Failed to create charity campaign." });
  }
};

// Update a charity campaign by ID
const updateHomeCarouselDataController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, backgroundImage, btnTitle, webLink, appLink } =
      req.body;

    const updatedCampaign = await updateHomeCarouselData(id, {
      title,
      description,
      backgroundImage,
      btnTitle,
      webLink,
      appLink,
    });
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating charity campaign:", error);
    res.status(500).json({ error: "Failed to update charity campaign." });
  }
};

// Delete a charity campaign by ID
const deleteHomeCarouselDataController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteHomeCarouselData(id);
    res.status(200).json({ message: "Charity campaign deleted successfully." });
  } catch (error) {
    console.error("Error deleting charity campaign:", error);
    res.status(500).json({ error: "Failed to delete charity campaign." });
  }
};

module.exports = {
  getAllHomeCarouselDataController,
  createHomeCarouselDataController,
  updateHomeCarouselDataController,
  deleteHomeCarouselDataController,
};
