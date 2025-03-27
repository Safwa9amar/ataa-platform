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

  const visits = await prisma.visit.count({
    where: {
      campiagnId: id,
    },
  });

  // Then, fetch the campaign details with the visits count

  return await prisma.campaign

    .findUnique({
      where: { id: id },

      include: {
        user: true,

        infoSectionsCards: true,

        infoSections: true,

        images: true,

        progress: true,

        field: true,

        category: true,

        appointments: true,

        donations: true,

        appointments: {
          orderBy: { createdAt: "desc" },
        },
      },

      // You can attach the visit count to the campaign result
    })

    .then((campaign) => {
      return {
        ...campaign,

        visits, // Add the visits count to the response
      };
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
  // console.log("campaignData", campaignData);

  if (campaignData.campaignStatus !== "ONGOING") {
    campaignData.fieldId = null;

    campaignData.categoryId = null;
  }

  // add createdByuserId to images

  let images = campaignData.images.map((image) => {
    image.userID = campaignData.createdByuserId || null;

    return image;
  });

  let proofFiles =
    campaignData.campaignStatus !== "ONGOING"
      ? {
          create: campaignData.proofFiles.map((file) => {
            file.userID = campaignData.createdByuserId || null;

            return file;
          }),
        }
      : undefined;

  return await prisma.campaign.create({
    data: {
      ...campaignData,

      createdByuserId: createdByuserId,

      progress: {
        create: {
          title: campaignData.title,

          progress: "0",

          rate: 0,

          requiredAmount: parseInt(campaignData.targetAmount),

          totalAmount: 0,
        },
      },

      images: {
        create: images,
      },

      proofFiles: proofFiles,
    },
  });
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
