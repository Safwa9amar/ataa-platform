const prisma = require("../../../models/index");
const dayjs = require("dayjs");
// Create a new invoice
const createInvoice = async (invoiceData, userID) => {
  let amount = invoiceData.invoiceProducts.reduce(
    (prev, curr) => prev + curr.quantity * curr.priceAtInvoice,
    0 // Initial value
  );

  const partner = await prisma.partner.findFirst({
    where: {
      User: {
        id: userID,
      },
    },
  });

  return await prisma.supplierInvoice.create({
    data: {
      ...invoiceData,
      partner: {
        connect: {
          id: partner.id,
        },
      },
      issueDate: dayjs(invoiceData.issueDate),
      paymentDate: dayjs(invoiceData.paymentDate),
      amount: amount,
      invoiceProducts: {
        create: invoiceData.invoiceProducts, // Create associated invoice products
      },
    },
    include: {
      invoiceProducts: true, // Include related products in the response
    },
  });
};

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
    const partner = await prisma.partner.findFirst({
      where: { User: { id: userID } },
    });

    if (!partner) {
      throw new Error("Partner not found for the given user.");
    }

    // Retrieve supplier invoices
    const invoices = await prisma.supplierInvoice.findMany({
      where: {
        ...keywordsFilter,
        partnerId: partner.id,
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

// Get an invoice by ID
const getInvoiceById = async (id) => {
  return await prisma.supplierInvoice.findUnique({
    where: { id },
    include: {
      invoiceProducts: {
        include: {
          product: true, // Include product details for each invoice product
        },
      },
    },
  });
};

// Update an invoice by ID
const updateInvoice = async (id, updateData) => {
  return await prisma.supplierInvoice.update({
    where: { id },
    data: updateData,
    include: {
      invoiceProducts: {
        include: {
          product: true, // Include product details for each invoice product
        },
      },
    },
  });
};

// Delete an invoice by ID
const deleteInvoice = async (id) => {
  return await prisma.supplierInvoice.delete({
    where: { id },
  });
};

// Add a product to an invoice
const addProductToInvoice = async (invoiceId, productData) => {
  return await prisma.invoiceProduct.create({
    data: {
      ...productData,
      invoiceId,
    },
    include: {
      product: true, // Include product details in the response
    },
  });
};

// Remove a product from an invoice
const removeProductFromInvoice = async (invoiceId, productId) => {
  return await prisma.invoiceProduct.delete({
    where: {
      id: productId,
      invoiceId,
    },
  });
};

// Update the quantity of a product in an invoice
const updateProductQuantityInInvoice = async (
  invoiceId,
  productId,
  quantity
) => {
  return await prisma.invoiceProduct.update({
    where: {
      id: productId,
      invoiceId,
    },
    data: { quantity },
    include: {
      product: true, // Include product details in the response
    },
  });
};

// Update the status of an invoice
const updateInvoiceStatus = async (id, status) => {
  return await prisma.supplierInvoice.update({
    where: { id },
    data: { status },
    include: {
      invoiceProducts: {
        include: {
          product: true, // Include product details for each invoice product
        },
      },
    },
  });
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  addProductToInvoice,
  removeProductFromInvoice,
  updateProductQuantityInInvoice,
  updateInvoiceStatus,
};
