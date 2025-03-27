const campaignService = require("../services/campaignService");
const campaignSchema = require("../schemas/validation/campaignSchemaValidator");

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns: ", error.message);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

const getCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await campaignService.getCampaignById(id);
    if (campaign) {
      res.status(200).json(campaign);
    } else {
      res.status(404).json({ error: "Campaign not found" });
    }
  } catch (error) {
    console.error("Error fetching campaign: ", error.message);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

// Get campaigns by user ID with pagination and filtering
const getCampaignsByUserId = async (req, res) => {
  const { types, status, progress, page = 1, keywords = "" } = req.query;
  const { userID } = req.params;

  try {
    const campaigns = await campaignService.getCampaignsByUserId(
      userID,
      types ? types.split(",") : [],
      status,
      progress ? progress : [0, 99],
      keywords,
      page
    );
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching user's campaigns: ", error.message);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// Get all campaigns by user, with better pagination handling
const getUsersCampaigns = async (req, res) => {
  const { types, status, progress, page = 1, keywords = "" } = req.query;

  try {
    const campaigns = await campaignService.getUsersCampaigns(
      types ? types.split(",") : [],
      status,
      progress ? progress : [0, 99],
      keywords,
      page
    );
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching user's campaigns: ", error.message);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// Create a new campaign
const createCampaign = async (req, res) => {
  const body = { ...req.body };
  isOngoing = body.campaignStatus === "ONGOING";
  const { id } = req.user;
  console.log(isOngoing);

  // const { error } = isOngoing
  //   ? campaignSchema.ongoingCampaignSchema.validate(body)
  //   : campaignSchema.normalCampaignSchema.validate(body);

  // if (error) {
  //   console.log("Validation Error: ", error.details[0].message);
  //   return res.status(400).json({ error: error.details[0].message });
  // }

  try {
    const newCampaign = await campaignService.createCampaign(req.body, id);
    res.status(201).json(newCampaign);
  } catch (error) {
    console.error("Error creating campaign: ", error.message);
    res
      .status(500)
      .json({ error: "Failed to create campaign", details: error.message });
  }
};

// Update an existing campaign
const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const { error } = campaignSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const updatedCampaign = await campaignService.updateCampaign(id, req.body);
    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign: ", error.message);
    res.status(500).json({ error: "Failed to update campaign" });
  }
};

// Delete a campaign
const deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    await campaignService.deleteCampaign(id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting campaign: ", error.message);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaigns,
  getCampaign,
  getCampaignsByUserId,
  getUsersCampaigns,
};
