const campaignService = require("./services");
exports.createCampaign = async (req, res) => {
    const body = req.body;
    const userId= req.user.id;
  try {
    const campaign = await campaignService.createNationalCampaign(body, userId);
    res.status(201).json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create campaign" });
  }
};

exports.getCampaignsByUser = async (req, res) => {
  const params = req.query;
  try {
    const userId = req.user.id;
    const campaigns = await campaignService.getCampaignsByUser(userId,params);
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
};

exports.getAllCampaigns = async (req, res) => {
  const params = req.query;
  
  try {
    const campaigns = await campaignService.getAllNationalCampaigns(params);
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
};

exports.getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await campaignService.getNationalCampaignById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch campaign" });
  }
};
