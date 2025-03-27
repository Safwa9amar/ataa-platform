const prisma = require("../models");
const getTrialEndDate = require("../utils/getTrialEndDate");

/**
 * Get all charities with optional filtering
 */
const getAllCharities = async (filters) => {
  return await prisma.charity.findMany({
    where: filters,
    include: {
      address: true,
      legalInfo: true,
      bankDetails: true,
      additionalDocuments: true,
      digitalPresence: true,
    },
  });
};

/**
 * Get a single charity by ID
 */
const searchChrities = async (wilaya, keywords) => {
  return await prisma.charity.findMany({
    where: {
      OR: [
        {
          legalName: { contains: keywords },
          address: { city: { contains: wilaya } },
        },
       
      ],
    },
    select: {
      id: true,
      legalName: true,
      commonName: true,
      oppertunities : true,
      address: {
        select: {
          city: true,
          state: true,
          street: true,
        },
      },
    },
  });
};
/**
 * Get a single charity by ID
 */
const getCharityById = async (id) => {
  return await prisma.charity.findUnique({
    where: { id },
    include: {
      address: true,
      legalInfo: true,
      bankDetails: true,
      additionalDocuments: true,
      digitalPresence: true,
    },
  });
};

/**
 * Create a new charity and link it to a user
 */
const createCharity = async (data, userId) => {
  console.log("creating charty.....", data);

  await prisma.charity.create({
    data: {
      ...data,
      establishmentDate: new Date(data.establishmentDate),
      User: {
        connect: { id: userId }, // Link the charity to the user by their ID
      },
      address: {
        create: data.address,
      },
      legalInfo: {
        create: data.legalInfo,
      },
      bankDetails: {
        create: data.bankDetails,
      },
      additionalDocuments: {
        create: data.additionalDocuments,
      },
      digitalPresence: {
        create: data.digitalPresence,
      },
    },
  });
  await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      registrationStatus: "COMPLETED",
      role: "charity",
      isActive: true,
      canCreateCampaign: true,
      trialEndDate: getTrialEndDate(7),
    },
  });
};

/**
 * Update a charity by ID
 */
const updateCharity = async (id, data) => {
  return await prisma.charity.update({
    where: { id },
    data,
  });
};

/**
 * Delete a charity by ID
 */
const deleteCharity = async (id) => {
  return await prisma.charity.delete({
    where: { id },
  });
};

module.exports = {
  getAllCharities,
  getCharityById,
  createCharity,
  updateCharity,
  deleteCharity,
  searchChrities,
};
