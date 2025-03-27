const Joi = require("joi");
const NationalCampaignService = require("../services/nationalCampaignService");

class NationalCampaignController {
  async getAll(req, res) {
    try {
      const campaigns = await NationalCampaignService.getAllCampaigns();
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const campaign = await NationalCampaignService.getCampaignById(id);

      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }

      res.status(200).json(campaign);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  }
  async getByQuery(req, res) {
    // Define the Joi schema for query validation
    const schema = Joi.object({
      willayaCode: Joi.string().optional(), // City name (optional)
      campaignName: Joi.string().optional(), // Campaign name (optional)
      targetUnitMin: Joi.number().integer().min(0).optional(), // Minimum target unit (optional)
      targetUnitMax: Joi.number().integer().min(0).optional(), // Maximum target unit (optional)
    });

    // Validate the incoming query against the schema
    const { error, value: validatedQuery } = schema.validate(req.query, {
      abortEarly: false,
    });

    if (error) {
      // Return validation errors as a response
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((detail) => detail.message),
      });
    }

    try {
      // Pass the validated query to the service
      const campaigns = await NationalCampaignService.getCampaignByQuery(
        validatedQuery
      );
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  }

  async create(req, res) {
    try {
      const campaignData = req.body;
      const newCampaign = await NationalCampaignService.createCampaign(
        campaignData
      );

      res.status(201).json(newCampaign);
    } catch (error) {
      console.log(error);

      res.status(400).json({ error: "Failed to create campaign" });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const campaignData = req.body;

      const updatedCampaign = await NationalCampaignService.updateCampaign(
        id,
        campaignData
      );

      res.status(200).json(updatedCampaign);
    } catch (error) {
      res.status(400).json({ error: "Failed to update campaign" });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      await NationalCampaignService.deleteCampaign(id);

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  }
}

module.exports = new NationalCampaignController();
