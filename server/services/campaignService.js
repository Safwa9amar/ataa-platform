// campaignService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const validator = require("validator");
// Get all campaigns
const getAllCampaigns = async () => {
  return await prisma.campaign.findMany({
    include: {
      user: true,
      infoSectionsCards: true,
      infoSections: true,
      images: true,
      progress: true,
      field: true,
      category: true,
    },
  });
};

// Get a single campaign by ID
const getCampaignById = async (id) => {
  // First, count the visits

  // Then, fetch the campaign details with the visits count
  return await prisma.campaign.findUnique({
    where: { id: id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      infoSectionsCards: true,
      infoSections: true,
      images: true,
      progress: true,
      field: true,
      category: true,
      appointments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      donations: true,
      appointments: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          donations: true,
          visits: true,
        },
      },
    },
    // You can attach the visit count to the campaign result
  });
};

const getCampaignsByUserId = async (
  userID,
  type,
  status,
  progress,
  keywords,
  page = 0,
  pageSize = 6
) => {
  // Calculate the offset
  const offset = (page - 1) * pageSize;
  // Fetch campaigns with pagination
  console.log(userID, type, status, progress, keywords);
  const searchFilter =
    keywords !== undefined && !validator.isEmpty(keywords)
      ? {
          OR: [
            {
              title: {
                contains: keywords,
              },
            },

            {
              description: {
                contains: keywords,
              },
            },
          ],
        }
      : undefined;
  const rateFilter = progress
    ? {
        rate: {
          gte: progress.split(",").map((p) => parseInt(p))[0],
          lte: progress.split(",").map((p) => parseInt(p))[1],
        },
      }
    : undefined;
  return await prisma.campaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      createdByuserId: userID,
      campaignStatus: {
        in:
          status === "all"
            ? ["URGENT", "NOT_URGENT", "ONGOING"]
            : status.split(","),
      },
      CampaignType: {
        in: type,
      },
      progress: rateFilter,
      ...searchFilter,
    },

    include: {
      infoSectionsCards: true,
      infoSections: true,
      images: true,
      progress: true,
      field: true,
      category: true,
      donations: true,
      appointments: true,
    },
    // skip: offset, // Skip the previous pages
    // take: pageSize, // Take the specified  of records
  });
};
const getUsersCampaigns = async (
  type,
  status,
  progress,
  keywords,
  page = 0,
  pageSize = 6
) => {
  // Calculate the offset
  const offset = (page - 1) * pageSize;
  console.log(type, status, progress, keywords);

  // Fetch campaigns with pagination]

  const searchFilter =
    keywords !== undefined && !validator.isEmpty(keywords)
      ? {
          OR: [
            {
              title: {
                contains: keywords,
              },
            },

            {
              description: {
                contains: keywords,
              },
            },
          ],
        }
      : undefined;

  const rateFilter = progress
    ? {
        rate: {
          gte: progress.split(",").map((p) => parseInt(p))[0],
          lte: progress.split(",").map((p) => parseInt(p))[1],
        },
      }
    : undefined;

  try {
    return await prisma.campaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        isAgreed: true,

        user: {
          role: "donor",
        },
        campaignStatus: {
          in:
            status === "all"
              ? ["URGENT", "NOT_URGENT", "ONGOING"]
              : status.split(","),
        },
        CampaignType: {
          in: type,
        },
        progress: rateFilter,

        ...searchFilter,
      },

      include: {
        infoSectionsCards: true,
        infoSections: true,
        images: true,
        progress: true,
        field: true,
        category: true,
        donations: true,
        appointments: true,
      },
      // skip: offset, // Skip the previous pages
      // take: pageSize, // Take the specified  of records
    });
  } catch (error) {
    console.error("error whie fetching users campaign", error);
  }
};

// Create a new campaign
const createCampaign = async (campaignData, createdByuserId) => {
  try {
    // Destructure campaignData for better readability
    const {
      CampaignType,
      unitPrice,
      numberOfUnits,
      campaignStatus,
      images,
      proofFiles,
      requiredAmount,
      numOfBeneficiaries,
      targetAmount,
      ...restCampaignData
    } = campaignData;

    // If campaign is not ongoing, remove fieldId and categoryId
    if (campaignStatus !== "ONGOING") {
      restCampaignData.fieldId = null;
      restCampaignData.categoryId = null;
    }

    // Add createdByuserId to images
    const updatedImages = images.map((image) => ({
      ...image,
      userID: createdByuserId || null,
    }));

    // Add createdByuserId to proofFiles if campaign is not ongoing
    const updatedProofFiles =
      campaignStatus !== "ONGOING"
        ? proofFiles.map((file) => ({
            ...file,
            userID: createdByuserId || null,
          }))
        : [];

    // Create the campaign in the database
    const campaign = await prisma.campaign.create({
      data: {
        ...restCampaignData,
        CampaignType,
        unitPrice,
        campaignStatus,
        createdByuserId,
        numberOfUnits: Number(numberOfUnits),
        numOfBeneficiaries: Number(numOfBeneficiaries),
        progress: {
          create: {
            title: restCampaignData.title,
            rate: 0,
            requiredAmount:
              CampaignType === "GOODS"
                ? Number(numberOfUnits) * Number(unitPrice)
                : Number(targetAmount),
            totalAmount: 0,
          },
        },
        images: {
          create: updatedImages,
        },
        proofFiles:
          updatedProofFiles.length > 0
            ? { create: updatedProofFiles }
            : undefined,
      },
      include: {
        images: true,
        proofFiles: true,
      },
    });

    // Return the created campaign with images and proofFiles
    return campaign;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw new Error("Failed to create campaign");
  }
};

// Update an existing campaign
const updateCampaign = async (id, campaignData) => {
  return await prisma.campaign.update({
    where: { id: id },
    data: campaignData,
  });
};

// Delete a campaign
const deleteCampaign = async (id) => {
  return await prisma.campaign.delete({
    where: { id: id },
  });
};

module.exports = {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  getCampaignsByUserId,
  getUsersCampaigns,
};
