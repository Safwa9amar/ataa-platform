const confirmMyorderService = require("../../../services/dashboardsServices/charity/confirmOrderReceipt");
// controllers/invoiceController.js
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const { reverseText } = require("../../../utils/helperFunctions");

async function confirmInvoice(req, res) {
  const { invoiceId } = req.query;
  const userID = req.user.id;

  try {
    let data = await confirmMyorderService.confirmInvoice(invoiceId, userID);
    res.json(data);
  } catch (error) {
    console.error("Error confirming ivnoice:", error);
    res.status(500).json({ error: "فشل تأكيد الطبية الرجاء اعادة المحاولة" });
  }
}

// Get all invoices
const getAllInvoices = async (req, res) => {
  const userID = req.user.id;
  try {
    const invoices = await confirmMyorderService.getAllInvoices(
      userID,
      req.query
    );
    res.json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve invoices", details: error.message });
  }
};

const generateInvoicePDF = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userID = req.user.id;
    const { invoice, charity } = await confirmMyorderService.getInvoiceById(
      invoiceId,
      userID
    );

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
      .text(reverseText(`الاسم: ${charity.legalName}`), { align: "right" });
    doc.text(reverseText(`الهاتف: ${charity.User.phone}`), { align: "right" });
    doc.text(reverseText(`البريد الإلكتروني: ${charity.User.email}`), {
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
  confirmInvoice,
  getAllInvoices,
  generateInvoicePDF,
};
