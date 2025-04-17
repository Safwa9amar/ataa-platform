const prisma = require("../models/index");
const getTrialEndDate = require("../utils/getTrialEndDate");
/**
 * Create a new Blood Agency
 * @param {Object} bloodAgencyData
 * @returns {Object} Created Blood Agency
 */
exports.createBloodAgency = async (userId, bloodAgencyData) => {
  let res = await prisma.bloodAgency.create({
    data: {
      ...bloodAgencyData,
      address: {
        create: bloodAgencyData.address,
      },
      user: {
        connect: { id: userId },
      },
    },
  });
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      registrationStatus: "COMPLETED",
      role: "blood_agency",
      isActive: true,
      canCreateCampaign: true,
      trialEndDate: getTrialEndDate(2000),
      bloodAgency: {
        connect: {
          id: res.id,
        },
      },
    },
  });

  return res;
};

/**
 * Get all Blood Agencies
 * @returns {Array} List of Blood Agencies
 */
exports.getAllBloodAgencies = async () => {
  return prisma.bloodAgency.findMany();
};

/**
 * Get Blood Agency by ID
 * @param {String} id
 * @returns {Object} Blood Agency
 */
exports.getBloodAgencyById = async (id) => {
  return prisma.bloodAgency.findUnique({
    where: { id },
  });
};

/**
 * Update Blood Agency by ID
 * @param {String} id
 * @param {Object} bloodAgencyData
 * @returns {Object} Updated Blood Agency
 */
exports.updateBloodAgency = async (id, bloodAgencyData) => {
  return prisma.bloodAgency.update({
    where: { id },
    data: bloodAgencyData,
  });
};

/**
 * Delete Blood Agency by ID
 * @param {String} id
 * @returns {Object} Deleted Blood Agency
 */
exports.deleteBloodAgency = async (id) => {
  return prisma.bloodAgency.delete({
    where: { id },
  });
};
