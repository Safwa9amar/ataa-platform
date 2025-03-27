// services/invoiceService.js
const prisma = require("../models");

/**
 * Get all invoices with optional filters
 * @param {object} filters - Optional filters (e.g., { userId: '123', startDate: '2024-01-01' })
 */
async function getAllInvoices(filters = {}) {
  const { userId, startDate, endDate, paymentStatus } = filters;
  console.log(filters);

  return await prisma.invoice.findMany({
    where: {
      ...(userId && {
        charity: {
          User: {
            id: userId,
          },
        },
      }),
      ...(paymentStatus && { paymentStatus }),
      ...(startDate &&
        endDate && {
          issueDate: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        }),
    },
    orderBy: {
      issueDate: "desc",
    },
  });
}

/**
 * Get an invoice record by ID
 * @param {string} id - Invoice ID
 */
async function getInvoiceById(id) {
  return await prisma.invoice.findUnique({
    where: { id },
    include: {
      charity: {
        include: {
          User: true,
        },
      },
    },
  });
}

/**
 * Create a new invoice record
 * @param {object} invoiceData - Invoice data
 */
async function createInvoice(invoiceData) {
  const user = await prisma.users.findUnique({
    where: {
      id: invoiceData.userId,
    },
  });

  delete invoiceData.userId; // Remove userId from data to avoid conflicts

  return await prisma.invoice.create({
    data: {
      ...invoiceData,
      charity: {
        connect: {
          id: user.charityId, // Link invoice to the user's charity
        },
      },
      invoiceAmount: parseFloat(invoiceData.invoiceAmount), // Ensure amount is a number
      issueDate: new Date(invoiceData.issueDate), // Convert to Date object
      paymentDate: invoiceData.paymentDate
        ? new Date(invoiceData.paymentDate)
        : null, // Optional field
    },
  });
}

/**
 * Update an invoice record by ID
 * @param {string} id - Invoice ID
 * @param {object} invoiceData - Invoice data
 */
async function updateInvoice(id, invoiceData) {
  return await prisma.invoice.update({
    where: { id },
    data: {
      ...invoiceData,
      ...(invoiceData.invoiceAmount && {
        invoiceAmount: parseFloat(invoiceData.invoiceAmount),
      }),
      ...(invoiceData.issueDate && {
        issueDate: new Date(invoiceData.issueDate),
      }),
      ...(invoiceData.paymentDate && {
        paymentDate: new Date(invoiceData.paymentDate),
      }),
    },
  });
}

/**
 * Delete an invoice record by ID
 * @param {string} id - Invoice ID
 */
async function deleteInvoice(id) {
  return await prisma.invoice.delete({
    where: { id },
  });
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
