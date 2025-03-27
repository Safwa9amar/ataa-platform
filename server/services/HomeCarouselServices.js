// services/charityCampaignServices.js
const prisma = require("../models/index");

// Get all charity campaigns
const getAllHomeCarouselData = async () => {
  return await prisma.homeCarouselData.findMany({
    orderBy: { createdAt: "desc" }, // Sort campaigns by creation date, newest first
  });
};

// Create a new charity campaign
const createHomeCarouselData = async ({
  title,
  description,
  backgroundImage,
  btnTitle,
  webLink,
  appLink,
}) => {
  return await prisma.homeCarouselData.create({
    data: {
      title,
      description,
      backgroundImage,
      btnTitle,
      webLink,
      appLink,
    },
  });
};

// Update a charity campaign by ID
const updateHomeCarouselData = async (
  id,
  { title, description, backgroundImage, btnTitle, webLink, appLink }
) => {
  return await prisma.charityCampaign.update({
    where: { id },
    data: {
      title,
      description,
      backgroundImage,
      btnTitle,
      webLink,
      appLink,
    },
  });
};

// Delete a charity campaign by ID
const deleteHomeCarouselData = async (id) => {
  return await prisma.charityCampaign.delete({
    where: { id },
  });
};

module.exports = {
  getAllHomeCarouselData,
  createHomeCarouselData,
  updateHomeCarouselData,
  deleteHomeCarouselData,
};
