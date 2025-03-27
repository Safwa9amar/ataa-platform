// controllers/invoiceController.js
const e = require("express");
const invoiceService = require("../services/invoiceService");

/**
 * Create a new invoice
 */
exports.addInvoice = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request
    const {
      invoiceNumber,
      paymentStatus,
      issuerBeneficiary,
      invoiceAmount,
      issueDate,
      paymentDate,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !invoiceNumber ||
      !paymentStatus ||
      !issuerBeneficiary ||
      !invoiceAmount ||
      !issueDate ||
      !userId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const invoiceData = {
      invoiceNumber,
      paymentStatus,
      issuerBeneficiary,
      invoiceAmount: parseFloat(invoiceAmount), // Ensure amount is a number
      issueDate: new Date(issueDate), // Convert to Date object
      paymentDate: paymentDate ? new Date(paymentDate) : null, // Optional field
      notes,
      userId, // Link invoice to the user
    };

    const invoice = await invoiceService.createInvoice(invoiceData);
    res.status(201).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all invoices
 */
exports.getAllInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request
    const invoices = await invoiceService.getAllInvoices({ userId }); // Filter by user
    res.status(200).json(invoices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get invoice by ID
 */
exports.getInvoiceById = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request
    const invoice = await invoiceService.getInvoiceById(req.params.id);

    console.log(invoice.charity.User.id, userId);
    // Check if invoice belongs to the user
    if (!invoice || invoice.charity.User.id !== userId) {
      return res.status(403).json({ message: "Invoice not found" });
    }
    delete invoice.charity;

    res.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update invoice by ID
 */
exports.updateInvoice = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request
    const invoiceId = req.params.id;

    // Fetch existing invoice to verify ownership
    const existingInvoice = await invoiceService.getInvoiceById(invoiceId);
    if (!existingInvoice || existingInvoice.charity.User.id !== userId) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Prepare update data
    const updateData = {
      ...req.body,
      ...(req.body.invoiceAmount && {
        invoiceAmount: parseFloat(req.body.invoiceAmount),
      }),
      ...(req.body.issueDate && { issueDate: new Date(req.body.issueDate) }),
      ...(req.body.paymentDate && {
        paymentDate: new Date(req.body.paymentDate),
      }),
    };

    const updatedInvoice = await invoiceService.updateInvoice(
      invoiceId,
      updateData
    );
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete invoice by ID
 */
exports.deleteInvoice = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from request
    const invoiceId = req.params.id;

    // Fetch existing invoice to verify ownership
    const existingInvoice = await invoiceService.getInvoiceById(invoiceId);
    if (!existingInvoice || existingInvoice.charity.User.id !== userId) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    await invoiceService.deleteInvoice(invoiceId);
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
