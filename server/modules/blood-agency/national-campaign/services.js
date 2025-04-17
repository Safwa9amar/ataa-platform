const prisma = require("../../../models/index");
/**
 * Creates a new national campaign with associated images and blood agency
 * @param {Object} data - Campaign data including images array
 * @param {string} userId - ID of the user creating the campaign
 * @returns {Promise<Object>} The created campaign with relations
 */
exports.createNationalCampaign = async (data, userId) => {
  // Validate required fields
  if (!data?.start_date || !data?.end_date) {
    throw new Error("Start date and end date are required");
  }

  // Fetch user with blood agency in a single optimized query
  const userWithAgency = await prisma.users.findUnique({
    where: { id: userId },
    select: { bloodAgency: { select: { id: true } } },
  });

  if (!userWithAgency?.bloodAgency?.id) {
    throw new Error("User must be associated with a blood agency");
  }

  return await prisma.nationalCampaign.create({
    data: {
      ...data,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      bloodAgency: { connect: { id: userWithAgency.bloodAgency.id } },
      images: {
        create: data.images,
      },
    },
  });
};
/**
 * Retrieves campaigns for a specific user with optional filtering and sorting
 * @param {string} userId - ID of the user to filter campaigns by
 * @param {Object} params - Optional filtering parameters
 * @param {string} [params.keywords] - Keywords to search in campaign titles (case-insensitive)
 * @param {string} [params.status] - Campaign status to filter by (converted to uppercase)
 * @returns {Promise<Array>} Array of campaign objects with related blood agency and appointments
 * @throws {Error} If database query fails or input validation fails
 */
exports.getCampaignsByUser = async (userId, params = {}) => {
  try {
    // Validate required input
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID provided");
    }

    // Destructure with default values to avoid undefined checks
    const { keywords = null, status = null } = params;

    // Prepare the query conditions
    const whereConditions = {
      bloodAgency: {
        user: {
          id: userId,
        },
      },
      ...(status && { status: String(status).toUpperCase() }),
      ...(keywords && {
        title: {
          contains: keywords,
          mode: "insensitive",
        },
      }),
    };

    // Execute the query with explicit type handling
    const campaigns = await prisma.nationalCampaign.findMany({
      where: whereConditions,
      include: {
        bloodAgency: true,
        appointments: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return campaigns;
  } catch (error) {
    // Enhance and rethrow the error with context
    console.error(`Failed to fetch campaigns for user ${userId}:`, error);
    throw new Error(`Campaign retrieval failed: ${error.message}`);
  }
};

exports.getAllNationalCampaigns = async (params) => {
  return await prisma.nationalCampaign.findMany({
    where: {
      wilaya: {
        contains: params?.wilaya?.willayaCode,
      },
    },
    include: {
      bloodAgency: true,
      appointments: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

exports.getNationalCampaignById = async (id) => {
  return await prisma.nationalCampaign.findUnique({
    where: { id },
    include: {
      bloodAgency: true,
      appointments: true,
    },
  });
};
