const {
  CampaignType,
  appointmentsStatus,
  GivingPartnersTypes,
  PartnershipType,
  NotificationType,
  NotificationPriority,
  NotificationActionState,
  NotificationDeliveryStatus,
  NotificationScope,
  Package,
  Status,
  PaymentMethod,
  BillingCycle,
  Role,
  RegistrationStatus,
  DonationTypes,
  donationOpportunityType,
  CampaignStatus,
  bloodType,
  EntityType,
  donationScoop,
  categoryType,
} = require("@prisma/client");
const express = require("express");
const router = express.Router();

router.get("/enums", (req, res) => {
  try {
    const enums = {
      categoryType,
      CampaignType,
      appointmentsStatus,
      GivingPartnersTypes,
      PartnershipType,
      NotificationType,
      NotificationPriority,
      NotificationActionState,
      NotificationDeliveryStatus,
      NotificationScope,
      Package,
      Status,
      PaymentMethod,
      BillingCycle,
      Role,
      RegistrationStatus,
      DonationTypes,
      donationOpportunityType,
      CampaignStatus,
      bloodType,
      EntityType,
      donationScoop,
    };
    res.status(200).json(enums);
  } catch (error) {
    console.error("Error fetching enums:", error.message);
    res.status(500).json({ error: "Failed to fetch enums" });
  }
});

module.exports = router;
