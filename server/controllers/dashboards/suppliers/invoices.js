const prisma = require("../../../models");
const invoiceService = require("../../../services/dashboardsServices/suppliers/invoices");
// controllers/invoiceController.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { reverseText } = require("../../../utils/helperFunctions");

// Create a new invoice
const createInvoice = async (req, res) => {
  console.log("POST /invoices");
  try {
    const invoiceData = req.body;
    const userID = req.user.id;
    const newInvoice = await invoiceService.createInvoice(invoiceData, userID);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ error: "Failed to create invoice", details: error.message });
  }
};

// Get all invoices
const getAllInvoices = async (req, res) => {
  console.log("GET /invoices");
  const userID = req.user.id;
  try {
    const invoices = await invoiceService.getAllInvoices(userID, req.query);
    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve invoices", details: error.message });
  }
};

// Get an invoice by ID
const getInvoiceById = async (req, res) => {
  console.log(`GET /invoices/${req.params.id}`);
  try {
    const { id } = req.params;
    const invoice = await invoiceService.getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve invoice", details: error.message });
  }
};

// // Get an invoice by ID
// const getInvoicePdfById = async (req, res) => {
//   console.log(`GET /invoices/${req.params.id}`);
//   try {
//     const { id } = req.params;
//     const invoice = await invoiceService.getInvoicePdfById(id);
//     if (!invoice) {
//       return res.status(404).json({ error: "Invoice not found" });
//     }
//     res.json(invoice);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Failed to retrieve invoice", details: error.message });
//   }
// };

// Update an invoice by ID
const updateInvoice = async (req, res) => {
  console.log(`PUT /invoices/${req.params.id}`);
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedInvoice = await invoiceService.updateInvoice(id, updateData);
    if (!updatedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(updatedInvoice);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update invoice", details: error.message });
  }
};

// Delete an invoice by ID
const deleteInvoice = async (req, res) => {
  console.log(`DELETE /invoices/${req.params.id}`);
  try {
    const { id } = req.params;
    const deletedInvoice = await invoiceService.deleteInvoice(id);
    if (!deletedInvoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete invoice", details: error.message });
  }
};

// Add a product to an invoice
const addProductToInvoice = async (req, res) => {
  console.log(`POST /invoices/${req.params.id}/products`);
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedInvoice = await invoiceService.addProductToInvoice(
      id,
      productData
    );
    res.status(201).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({
      error: "Failed to add product to invoice",
      details: error.message,
    });
  }
};

// Remove a product from an invoice
const removeProductFromInvoice = async (req, res) => {
  console.log(
    `DELETE /invoices/${req.params.invoiceId}/products/${req.params.productId}`
  );
  try {
    const { invoiceId, productId } = req.params;
    const updatedInvoice = await invoiceService.removeProductFromInvoice(
      invoiceId,
      productId
    );
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({
      error: "Failed to remove product from invoice",
      details: error.message,
    });
  }
};

// Update the quantity of a product in an invoice
const updateProductQuantityInInvoice = async (req, res) => {
  console.log(
    `PUT /invoices/${req.params.invoiceId}/products/${req.params.productId}`
  );
  try {
    const { invoiceId, productId } = req.params;
    const { quantity } = req.body;
    const updatedInvoice = await invoiceService.updateProductQuantityInInvoice(
      invoiceId,
      productId,
      quantity
    );
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update product quantity in invoice",
      details: error.message,
    });
  }
};

// Update the status of an invoice
const updateInvoiceStatus = async (req, res) => {
  console.log(`PUT /invoices/${req.params.id}/status`);
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedInvoice = await invoiceService.updateInvoiceStatus(id, status);
    res.json(updatedInvoice);
  } catch (error) {
    res.status(500).json({
      error: "Failed to update invoice status",
      details: error.message,
    });
  }
};
const generateInvoicePDF = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    const userID = req.user.id;
    const invoice = await prisma.supplierInvoice.findUnique({
      where: {
        id: invoiceId,
      },
      include: {
        partner: true,
        invoiceProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!invoice) {
      return res.status(404).send("لم يتم العثور على الفاتورة");
    }

    const filename = `invoice-${invoiceId}.pdf`;
    const filePath = path.join(__dirname, filename);

    const doc = new PDFDocument({ margin: 30, lang: "ar-EG" });
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const fontPath = path.join(
      __dirname,
      "../../../assets",
      "fonts",
      "ElMessiri.ttf"
    );
    doc.font(fontPath);

    // إضافة إطار للفاتورة
    doc.rect(20, 20, 570, 750).stroke();

    // إدراج الشعار
    const logoPath = path.join(__dirname, "../../../assets", "fullLogo.png");
    doc.image(logoPath, 30, 30, { width: 100 });

    // عنوان الفاتورة
    doc.fontSize(22).text(reverseText("فاتورة متابعة"), 0, 50, {
      align: "center",
      bold: true,
    });
    doc.moveDown(1);

    // تفاصيل الفاتورة
    doc
      .fontSize(14)
      .text(reverseText(`رقم الفاتورة: ${invoice.id}`), { align: "right" });
    doc.text(reverseText(`رقم فرصة التبرع: ${invoice.donationOpportunityId}`), {
      align: "right",
    });
    doc.text(
      reverseText(
        `تاريخ الإصدار: ${dayjs(invoice.issueDate).format("YYYY/MM/DD")}`
      ),
      { align: "right" }
    );
    doc.text(
      reverseText(
        `تاريخ الدفع: ${dayjs(invoice.paymentDate).format("YYYY/MM/DD")}`
      ),
      { align: "right" }
    );
    doc.moveDown(1);

    // تفاصيل العميل
    doc
      .fontSize(16)
      .text(reverseText("تفاصيل العميل"), { underline: true, align: "right" });
    doc
      .fontSize(14)
      .text(reverseText(`الاسم: ${invoice.partner.companyName}`), {
        align: "right",
      });
    doc.text(reverseText(`الهاتف: ${invoice.partner.phone}`), {
      align: "right",
    });
    doc.text(reverseText(`البريد الإلكتروني: ${invoice.partner.email}`), {
      align: "right",
    });
    doc.moveDown(1);

    // المنتجات - جدول
    doc
      .fontSize(16)
      .text(reverseText("المنتجات"), { underline: true, align: "right" });
    doc.moveDown(0.5);

    const tableTop = doc.y;
    const columnWidths = [50, 200, 80, 80, 80];
    const startX = 50;

    // رأس الجدول مع تلوين الخلفية
    doc.rect(startX, tableTop, 500, 20).fill("#f0f0f0").stroke();
    doc.fillColor("black").fontSize(12);
    doc.text(reverseText("رقم"), startX + 450, tableTop + 5, {
      width: columnWidths[0],
      align: "center",
    });
    doc.text(reverseText("اسم المنتج"), startX + 300, tableTop + 5, {
      width: columnWidths[1],
      align: "center",
    });
    doc.text(reverseText("الكمية"), startX + 220, tableTop + 5, {
      width: columnWidths[2],
      align: "center",
    });
    doc.text(reverseText("سعر الوحدة"), startX + 140, tableTop + 5, {
      width: columnWidths[3],
      align: "center",
    });
    doc.text(reverseText("الإجمالي"), startX + 50, tableTop + 5, {
      width: columnWidths[4],
      align: "center",
    });
    doc.moveDown(0.5);

    // إدراج المنتجات داخل الجدول مع تمييز الصفوف بالتناوب
    invoice.invoiceProducts.forEach((product, index) => {
      const rowY = doc.y + 5;
      const bgColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      doc
        .rect(startX, rowY - 5, 500, 20)
        .fill(bgColor)
        .stroke();
      doc.fillColor("black").fontSize(12);
      doc.text(`${index + 1}`, startX + 450, rowY, {
        width: columnWidths[0],
        align: "center",
      });
      doc.text(reverseText(product.product.name), startX + 300, rowY, {
        width: columnWidths[1],
        align: "center",
      });
      doc.text(`${product.quantity}`, startX + 220, rowY, {
        width: columnWidths[2],
        align: "center",
      });
      doc.text(`${product.product.price} دج`, startX + 140, rowY, {
        width: columnWidths[3],
        align: "center",
      });
      doc.text(
        `${product.product.price * product.quantity} دج`,
        startX + 50,
        rowY,
        { width: columnWidths[4], align: "center" }
      );
      doc.moveDown(0.5);
    });

    doc.moveDown(1);
    doc.fontSize(16).text(reverseText(`الإجمالي: ${invoice.amount} دج`), {
      bold: true,
      align: "left",
    });

    // ملاحظات
    if (invoice.notes) {
      doc.moveDown(1);
      doc
        .fontSize(12)
        .text(reverseText("ملاحظات:"), { underline: true, align: "right" });
      doc.text(reverseText(invoice.notes), { align: "right" });
    }
    doc.end();

    writeStream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.sendFile(filePath, (err) => {
        if (err) console.error("Error sending file:", err);
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr)
            console.error("Error deleting temporary PDF:", unlinkErr);
        });
      });
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "خطأ أثناء إنشاء الفاتورة" });
  }
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
  generateInvoicePDF,
};
