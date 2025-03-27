const express = require("express");
const { celebrate, Joi, errors } = require("celebrate");
const campaignController = require("../controllers/campaignController");
const authenticate = require("../middlewares/authMiddleware");
const {
  uniqueVisitorMiddlewareForCampaigns,
} = require("../middlewares/uniqueVisitorsMiddleware");

const router = express.Router();

// ✅ Public Routes (No Authentication Required)
router.get("/campaigns", campaignController.getCampaigns);
router.get(
  "/campaigns/:id",
  uniqueVisitorMiddlewareForCampaigns,
  campaignController.getCampaign
);

// Alternative route for users' campaigns
router.get(
  "/campaigns-users",
  celebrate({
    query: Joi.object({
      types: Joi.string(),
      status: Joi.string()
        .valid("ONGOING", "URGENT", "NOT_URGENT", "all")
        .optional(),
      progress: Joi.string().optional(),
      page: Joi.number().integer().min(1).default(1),
      keywords: Joi.string().allow("").optional(),
    }),
  }),
  campaignController.getUsersCampaigns
);

// ✅ Private Routes (Require Authentication)
router.put("/campaigns/:id", authenticate, campaignController.updateCampaign);
router.delete(
  "/campaigns/:id",
  authenticate,
  campaignController.deleteCampaign
);
router.post("/campaigns", authenticate, campaignController.createCampaign);

// User-specific campaigns (Require Authentication)
router.get(
  "/campaigns-user/:userID",
  authenticate, // 👈 Add authentication middleware here
  celebrate({
    query: Joi.object({
      types: Joi.string(),
      status: Joi.string()
        .valid("ONGOING", "URGENT", "NOT_URGENT", "all")
        .optional(),
      progress: Joi.string().optional(),
      page: Joi.number().integer().min(1).default(1),
      keywords: Joi.string().allow("").optional(),
    }),
  }),
  campaignController.getCampaignsByUserId
);

// Handle Celebrate errors
router.use(errors());

module.exports = router;
