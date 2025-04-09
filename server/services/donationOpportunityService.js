const prisma = require("../models");
// Fetch all donation opportunities
exports.getAllDonationOpportunities = async (req, res) => {
  const field = req.params.field;
  const category = req.params.category;
  const { filterData, keywords, rate } = req.body;

  let categoryFilter = {};
  filterData &&
    Object.entries(filterData).forEach(([key, value]) => {
      if (value) {
        categoryFilter[key] = value;
      }
    });

  try {
    let data = await prisma.donationOpportunity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        type: req.params.type ? req.params.type : undefined,
        OR: [
          {
            title: keywords
              ? { contains: keywords?.toString() }
              : { contains: "" },
          },
          {
            description: keywords
              ? { contains: keywords?.toString() }
              : { contains: "" },
          },
        ],
        field: {
          OR: [
            {
              title:
                field === "all" || field === undefined
                  ? { contains: "" }
                  : field,
            },
            {
              ar_title:
                field === "all" || field === undefined
                  ? { contains: "" }
                  : field,
            },
          ],
        },
        category: {
          OR: [
            {
              title:
                category === "all" || category === undefined
                  ? { contains: "" }
                  : category,
            },
            {
              ar_title:
                category === "all" || category === undefined
                  ? { contains: "" }
                  : category,
            },
          ],
          ...categoryFilter,
        },
        progress: {
          rate: rate ? rate : { gte: 0 },
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        progress: true,
        cardImage: true,
        images: true,
        field: true,
        category: {
          select: {
            id: true,
            title: true,
            ar_title: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error("error while fetch donation opportunities", error.message);
    throw new Error("Failed to fetch donation opportunities");
  }
};

// Fetch a specific donation opportunity by ID
exports.getDonationOpportunityById = async (id) => {
  // First, count the visits
  const visits = await prisma.visit.count({
    where: {
      donationOppertunityID: id,
    },
  });
  try {
    return await prisma.donationOpportunity
      .findUnique({
        where: { id: id },
        include: {
          infoSectionsCards: true,
          infoSections: {
            include: {
              infoBlocks: true,
            },
          },
          images: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          progress: true,
          field: true,
          category: {
            include: {
              Mosques: true,
              Orphans: true,
            },
          },
        },
      })
      .then((opprt) => {
        return {
          ...opprt,
          visits,
        };
      });
  } catch (error) {
    console.error("error while fetch donation opportunity", error.message);
    throw new Error("Failed to fetch donation opportunity");
  }
};

// Create a new donation opportunity
exports.createDonationOpportunity = async (data, user) => {
  const {
    targetType,
    unitPrice,
    selectedCategoryType: catType,
    category,
    wilaya,
    images,
    proofFiles,
    partnershipContract,
    approvalLetter,
    targetAmount,
    title,
    numOfBeneficiaries,
    field,
    type,
  } = data;

  try {
    // Create the category if the type and data are valid
    let createdCategory = null;
    if (catType && prisma[catType]) {
      createdCategory = await prisma[catType].create({
        data: {
          ...category[catType],
          category: {
            connect: { id: category.id },
          },
        },
      });
    }

    // Construct additional connection data for the donation opportunity
    const categoryConnections = createdCategory
      ? {
          [catType]: {
            connect: { id: createdCategory.id },
          },
        }
      : {};

    return await prisma.donationOpportunity.create({
      data: {
        donationScoop: data.donationScoop,
        title: data.title,
        description: data.description,
        overview: data.overview,
        type: type,
        daira: data.daira,
        commune: data.commune,
        targetType: data.targetType,
        targetAmount: data.targetAmount,
        numOfBeneficiaries: Number(numOfBeneficiaries),
        needs: data.needs,

        partner_name: data.partner_name,
        partner_role: data.partner_role,

        commitmentTransparency: true,
        commitmentReporting: true,

        wilaya: {
          connect: { id: wilaya },
        },
        images: {
          create: images,
        },
        proofFiles: {
          create: proofFiles,
        },
        partnershipContract: {
          create: partnershipContract,
        },
        approvalLetter: {
          create: approvalLetter,
        },
        progress: {
          create: {
            requiredAmount:
              targetType === "MONEY"
                ? Number(targetAmount)
                : Number(targetAmount) * unitPrice,
            rate: 0,
            totalAmount: 0,
            title: title,
          },
        },
        user: {
          connect: { id: user.id },
        },
        field: {
          connect: { id: field },
        },
        category: {
          connect: { id: category },
        },
        // ...categoryConnections,
      },
    });
  } catch (error) {
    console.error("Error while creating donation opportunity:", error.message);
    throw new Error("Failed to create donation opportunity");
  }
};

// Update a donation opportunity by ID
exports.updateDonationOpportunity = async (id, data) => {
  try {
    return await prisma.donationOpportunity.update({
      where: { id },
      data,
    });
  } catch (error) {
    throw new Error("Failed to update donation opportunity");
  }
};
// Update a donation opportunity by ID
exports.getMyDonationOpportunities = async (userId, params) => {
  const { status, keywords } = params;
  try {
    return await prisma.donationOpportunity.findMany({
      orderBy : {
        createdAt: 'desc'
      },
      where: {
        user: {
          id: userId,
        },
        status: String(status).toUpperCase(),
        OR: [
          {
            title: keywords
              ? { contains: keywords?.toString() }
              : { contains: "" },
          },
          {
            description: keywords
              ? { contains: keywords?.toString() }
              : { contains: "" },
          },
        ],
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    throw new Error("Failed to update donation opportunity");
  }
};

// Delete a donation opportunity by ID
exports.deleteDonationOpportunity = async (id) => {
  try {
    return await prisma.donationOpportunity.delete({
      where: { id },
    });
  } catch (error) {
    throw new Error("Failed to delete donation opportunity");
  }
};

exports.getAllDonationOpportunitiesForHome = async (role) => {
  let OR =
    role !== undefined && role !== "undefined" && role !== "donor"
      ? {
          type: role === "partner" ? "storeOpportunity" : "normalOpportunity",
        }
      : {};

  try {
    return await prisma.donationOpportunity.findMany({
      where: {
        ...OR,
      },
      take: 4,
      select: {
        id: true,
        title: true,
        category: {
          select: {
            title: true,
            ar_title: true,
          },
        },
        field: {
          select: {
            color: true,
          },
        },
        progress: {
          select: {
            requiredAmount: true,
            totalAmount: true,
          },
        },
        images: true,
      },
    });
  } catch (error) {
    throw new Error("Failed to fetch donation opportunities");
  }
};
