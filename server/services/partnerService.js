const prisma = require("../models/index");
const getTrialEndDate = require("../utils/getTrialEndDate");

// Create a new partner
const createPartner = async (userId, partnerData) => {
  console.log(partnerData, userId);

  let partner = await prisma.partner.create({
    data: {
      ...partnerData,
      digitalPresence: {
        create: partnerData.digitalPresence,
      },
      User: { connect: { id: userId } }, // Link the partner to the user
    },
  });
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      registrationStatus: "COMPLETED",
      role: "partner",
      isActive: true,
      canCreateCampaign: true,
      trialEndDate: getTrialEndDate(2000),
    },
  });
  return partner;
};

// Get a partner by ID
const getPartnerById = async (id) => {
  return await prisma.partner.findUnique({
    where: { id },
    include: {
      logo: true,
      digitalPresence: true,
    },
  });
};

// Update a partner's details
const updatePartner = async (id, partnerData) => {
  return await prisma.partner.update({
    where: { id },
    data: partnerData,
  });
};

// Delete a partner
const deletePartner = async (id) => {
  return await prisma.partner.delete({
    where: { id },
  });
};

module.exports = {
  createPartner,
  getPartnerById,
  updatePartner,
  deletePartner,
};
