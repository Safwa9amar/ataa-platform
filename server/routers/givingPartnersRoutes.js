const express = require("express");
const router = express.Router();
const givingPartnersController = require("../controllers/givingPartnersController");

router.get("/givingPartners/", givingPartnersController.getAllGivingPartners);
router.get(
  "/givingPartners/:id",
  givingPartnersController.getGivingPartnerById
);
router.post("/givingPartners/", givingPartnersController.createGivingPartner);
router.put("/givingPartners/:id", givingPartnersController.updateGivingPartner);
router.delete(
  "/givingPartners/:id",
  givingPartnersController.deleteGivingPartner
);

module.exports = router;
