const repportsService = require("../services/repportsService");
const fs = require("fs");
const path = require("path");
const libre = require("libreoffice-convert");
const setupMailer = require("../utils/mailer");
const mailer = setupMailer();

// Helper function to load a DOCX template from the file system
function loadTemplate(templateName) {
  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    "repports",
    templateName
  );
  return fs.readFileSync(templatePath);
}

// Helper function to set headers for file downloads
function setDownloadHeaders(res, filename, type = "docx") {
  const contentTypes = {
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pdf: "application/pdf",
  };
  res.setHeader("Content-Type", contentTypes[type] || contentTypes.docx);
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
}

// Helper function to convert DOCX to PDF
function convertToPDF(buffer) {
  return new Promise((resolve, reject) => {
    libre.convert(buffer, "pdf", undefined, (err, pdfBuffer) => {
      if (err) reject(err);
      else resolve(pdfBuffer);
    });
  });
}

// Helper function to send email with attachments
function sendEmail(to, subject, text, attachment) {
  return mailer.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments: [attachment],
  });
}

// Helper function to handle report generation and response
async function generateAndSendReport(
  req,
  res,
  reportServiceMethod,
  templateName,
  filename,
  emailSubject,
  reportParams = {}
) {
  try {
    const template = loadTemplate(templateName);
    const buffer = await reportServiceMethod(
      template,
      ...Object.values(reportParams)
    );

    if (false) {
      const pdfBuffer = await convertToPDF(buffer);
      setDownloadHeaders(res, `${filename}.pdf`, "pdf");
      res.send(pdfBuffer);
    } else {
      setDownloadHeaders(res, `${filename}.docx`);
      res.send(buffer);
    }

    await sendEmail(req.user.email, emailSubject, "التقرير مرفق بالرسالة", {
      filename: `${filename}.docx`,
      content: buffer,
    });
  } catch (error) {
    console.error(`Error generating ${filename} report:`, error);
    res
      .status(500)
      .json({ message: `Error generating ${filename} report`, error });
  }
}

// Report Controllers
async function getZakatRepport(req, res) {
  await generateAndSendReport(
    req,
    res,
    repportsService.getZakatRepport,
    "zakatReport.docx",
    "zakatReport",
    "تقرير الزكاة منصة عطاء",
    { year: req.params.year, email: req.user.email }
  );
}

async function getDonationOpportunitiesRepports(req, res) {
  await generateAndSendReport(
    req,
    res,
    repportsService.getDonationOpportunitiesRepports,
    "donationOpportunitiesReport.docx",
    "donationOpportunitiesReport",
    "تقرير فرص العطاء منصة عطاء",
    { id: req.params.id }
  );
}

async function getCampaignsRepports(req, res) {
  await generateAndSendReport(
    req,
    res,
    repportsService.getCampaignsRepports,
    "userCampaignReport.docx",
    "userCampaignReport",
    "تقرير الحملات منصة عطاء",
    { id: req.params.id }
  );
}

async function getUserBalanceRepports(req, res) {
  await generateAndSendReport(
    req,
    res,
    repportsService.getUserBalanceRepports,
    "userBalanceReport.docx",
    "userBalanceReport",
    "تقرير الرصيد منصة عطاء",
    { from: req.params.from, to: req.params.to, email: req.user.email }
  );
}

async function getDonationsRepports(req, res) {
  await generateAndSendReport(
    req,
    res,
    repportsService.getDonationsRepports,
    "userDonationsReport.docx",
    "userDonationsReport",
    "تقرير التبرعات منصة عطاء",
    { from: req.params.from, to: req.params.to, email: req.user.email }
  );
}

module.exports = {
  getZakatRepport,
  getDonationOpportunitiesRepports,
  getCampaignsRepports,
  getUserBalanceRepports,
  getDonationsRepports,
};
