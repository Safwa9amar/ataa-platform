const dayjs = require("dayjs");
const prisma = require("../../../models");

// Get all invoices
const getAllInvoices = async (userID, query) => {
  try {
    const { keywords, page = 1, limit = 10 } = query;

    // Construct search filter for keywords
    const keywordsFilter = keywords
      ? {
          OR: [
            { id: { contains: keywords.toString() } },
            { donationOpportunityId: { contains: keywords.toString() } },
          ],
        }
      : {};

    // Retrieve the partner associated with the user
    const charity = await prisma.charity.findFirst({
      where: { User: { id: userID } },
    });

    if (!charity) {
      throw new Error("charity not found for the given user.");
    }

    // Retrieve supplier invoices
    const invoices = await prisma.supplierInvoice.findMany({
      where: {
        ...keywordsFilter,
        charityId: charity.id,
      },
      include: {
        invoiceProducts: {
          include: { product: true }, // Include product details
        },
      },
      skip: (page - 1) * limit,
      take: parseInt(limit, 10),
      orderBy: { createdAt: "desc" }, // Sort by latest invoices
    });

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error.message);
    throw new Error("Failed to retrieve invoices. Please try again.");
  }
};

// Get by id
const getInvoiceById = async (id, userID) => {
  try {
    // Retrieve the partner associated with the user
    const charity = await prisma.charity.findFirst({
      where: { User: { id: userID } },
      include: {
        User: true,
      },
    });

    if (!charity) {
      throw new Error("charity not found for the given user.");
    }
    const invoice = await prisma.supplierInvoice.findUnique({
      where: {
        id: id,
        charityId: charity.id,
      },
      include: {
        invoiceProducts: {
          include: { product: true }, // Include product details
        },
      },
    });

    return { invoice, charity };
  } catch (error) {
    console.error("Error fetching invoices:", error.message);
    throw new Error("Failed to retrieve invoices. Please try again.");
  }
};

const confirmInvoice = async (invoiceId, userID) => {
  // Retrieve the partner associated with the user
  const charity = await prisma.charity.findFirst({
    where: { User: { id: userID } },
    include: {
      User: true,
    },
  });

  return prisma.supplierInvoice.update({
    where: {
      id: invoiceId,
      charityId: charity.id,
    },

    data: {
      confirmationStatus: "CONFIRMED_CHARITY",
      confirmedByCharityAt: new Date(),
      invoiceTracking: {
        create: {
          changedBy: "charity",
          status: "CONFIRMED_CHARITY",
        },
      },
    },
  });
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  confirmInvoice,
};
