const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const prisma = require("../models");
const dayjs = require("dayjs"); // For Node.js, or include via <script> for browser
const currentDate = dayjs();
const startOfDay = (date) => dayjs(date).startOf("day").toDate();
const endOfDay = (date) => dayjs(date).endOf("day").toDate();

const balanceTypeLabel = {
  campaign: "حملة تبرع",
  donationOpportunity: "فرص تبرع المنصة",
  zakat: "زكاة",
  cart: "سلة التبرع",
  store: "تبرع للمتجر",
  other: "استخدام آخر",
};
// Helper to load DOCX template and return a Docxtemplater instance
function loadTemplate(template) {
  const zip = new PizZip(template);
  return new Docxtemplater(zip);
}

// Helper to generate buffer from Docxtemplater instance
function generateBuffer(doc) {
  doc.render();
  return doc.getZip().generate({ type: "nodebuffer" });
}

// Helper to fetch donations or recharges
async function fetchData(model, whereOptions = {}, includeOptions = {}) {
  return await prisma[model].findMany({
    where: whereOptions,
    include: includeOptions,
  });
}

// Zakat Report Generation
// Zakat Report Generation
async function getZakatRepport(template, year, email) {
  // Set up the date range for the specified year, or leave empty if no year provided

  try {
    // Load the template
    const doc = loadTemplate(template);

    // Find the user by email
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    // Find the Zakat record for the user in the specified year
    const zakat = await prisma.zakat.findFirst({
      where: {
        userId: user.id,
        year: year === "undefined" ? new Date().getFullYear() : Number(year),
      },
    });

    if (!zakat) {
      throw new Error(
        `No Zakat record found for user ${email} in year ${year}`
      );
    }

    // Set the data for the document
    doc.setData({
      id: zakat.id,
      goldAmount: zakat.goldAmount,
      silverAmount: zakat.silverAmount,
      stockAmount: zakat.stockAmount,
      cashAmount: zakat.cashAmount,
      zakatTotal: zakat.zakatTotal,
      donatedZakat: zakat.donatedZakat,
      createdAt: dayjs(zakat.createdAt).format("YYYY-MM-DD"),
    });

    // Generate and return the report buffer
    return generateBuffer(doc);
  } catch (error) {
    console.error("Error generating zakat report:", error.message);

    // Throw a specific error if Zakat data is missing
    if (error.message.includes("No Zakat record found")) {
      throw new Error("No Zakat data available for the specified year.");
    }

    throw new Error(
      "Failed to generate Zakat report due to an unexpected error."
    );
  }
}

// User Balance Report Generation
async function getUserBalanceRepports(template, from, to, email) {
  try {
    const doc = loadTemplate(template);

    // Fetching recharges and balance uses

    const recharges = await prisma.recharge.findMany({
      where: {
        createdAt: {
          gte: startOfDay(from), // Start of the selected day
          lte: endOfDay(to), // End of the selected day
        },
        user: { email },
      },
    });

    const balanceUses = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: startOfDay(from), // Start of the selected day
          lte: endOfDay(to), // End of the selected day
        },
        user: { email },
        paymentMethod: "useBalance",
      },
      include: {
        donationOpportunity: true,
        campaign: true,
      },
    });

    // Setting data for DOCX template
    doc.setData({
      recharges: recharges.map((r) => ({
        date: dayjs(r.createdAt).format("YYYY-MM-DD"),
        time: dayjs(r.createdAt).format("HH:mm:ss"),
        points: r.amount,
        amount: r.amount,
      })),
      balanceUses: balanceUses.map((b) => {
        const balanceTypeLabel = {
          campaign: "حملة تبرع",
          donationOpportunity: "فرص تبرع المنصة",
          zakat: "زكاة",
          cart: "سلة التبرع",
          store: "تبرع للمتجر",
          other: "استخدام آخر",
        };
        const status =
          b.donationType === "campaign"
            ? b.campaign?.progress?.rate === 100
              ? "مكتمل"
              : "غير مكتمل"
            : b.donationType === "donationOpportunity"
            ? b.donationOpportunity?.progress?.rate === 100
              ? "مكتمل"
              : "غير مكتمل"
            : "غير مكتمل";

        return {
          id: b.id,
          date: dayjs(b.createdAt).format("YYYY-MM-DD\nHH:mm:ss"),
          oppTitle:
            b.donationType === "campaign"
              ? b.campaign.title
              : b.donationType === "donationOpportunity"
              ? b.donationOpportunity.title
              : "",
          status: status,
          type: balanceTypeLabel[b.donationType],
          ...b,
        };
      }),
      createdAt: currentDate.format("YYYY-MM-DD"),
      from,
      to,
    });

    return generateBuffer(doc);
  } catch (error) {
    console.error("Error generating user balance report:", error);
    throw new Error("Failed to generate user balance report");
  }
}

// Donation Opportunities Report Generation
async function getDonationOpportunitiesRepports(template, id) {
  try {
    const doc = loadTemplate(template);
    // Set data for template and generate the buffer
    const donationOpportunity = await prisma.donationOpportunity.findUnique({
      where: { id: id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        field: {
          select: {
            ar_title: true,
          },
        },
        category: {
          select: {
            ar_title: true,
          },
        },
        progress: {
          select: {
            totalAmount: true,
          },
        },
        wilaya: {
          select: {
            wilaya_name: true,
          },
        },
      },
    });
    doc.setData({
      title: donationOpportunity.title,
      numberBeneficiaries: donationOpportunity.numOfBeneficiaries,
      ImplementingPartner: donationOpportunity.user.name,
      amount: donationOpportunity.progress.totalAmount,
      id: donationOpportunity.id,
      ar_field: donationOpportunity.field.ar_title,
      ar_category: donationOpportunity.category.ar_title,
      date: donationOpportunity.createdAt.toDateString(),
      description: donationOpportunity.description.slice(0, 150),
      wilaya: donationOpportunity.wilaya.wilaya_name,
      endAt:
        dayjs(donationOpportunity.endAt).format("YYYY/MM/DD") || "لم تكتمل بعد",
      createdAt: dayjs(donationOpportunity.createdAt).format("YYYY/MM/DD"),
    });

    return generateBuffer(doc);
  } catch (error) {
    console.error("Error generating donation opportunities report:", error);
    throw new Error("Failed to generate donation opportunities report");
  }
}

// Campaigns Report Generation (future implementation)
async function getCampaignsRepports(template, id) {
  try {
    const doc = loadTemplate(template);
    // Set data for template and generate the buffer
    let campaign = await prisma.campaign.findUnique({
      where: { id: id },
      include: {
        progress: true,
        user: true,
      },
    });
    let wilaya = await prisma.algeriaCities.findFirst({
      where: { wilaya_code: campaign.wilaya },
    });
    doc.setData({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      numberBeneficiaries: campaign.numOfBeneficiaries,
      wilaya: wilaya.wilaya_name,
      createdBy: campaign.user.name,
      CampaignTypeName:
        campaign.CampaignType === "BLOOD" || campaign.CampaignType === "GOODS"
          ? "جمع وحدات"
          : "جمع تبرعات مالية",
      isUnits:
        campaign.CampaignType === "BLOOD" || campaign.CampaignType === "GOODS",
      unitPrice: campaign.unitPrice,
      isMoney: campaign.CampaignType === "MONEY",
      numberOfUnits: campaign.numberOfUnits,
      CampaignType: campaign.CampaignType,
      totalAmount: campaign.progress.totalAmount,
      requiredAmount: campaign.progress.requiredAmount,
      endAt: dayjs(campaign.endAt).format("YYYY/MM/DD") || "لم تكتمل بعد",
      createdAt: dayjs(campaign.createdAt).format("YYYY/MM/DD"),
    });
    return generateBuffer(doc);
  } catch (error) {
    console.error("Error generating campaigns report:", error);
    throw new Error("Failed to generate campaigns report");
  }
}

// Donations Report Generation
async function getDonationsRepports(template, from, to, email) {
  try {
    const doc = loadTemplate(template);

    const donations = await fetchData(
      "donation",
      {
        createdAt: {
          gte: startOfDay(from), // Start of the selected day
          lte: endOfDay(to), // End of the selected day
        },
        user: { email },
      },
      {
        campaign: { select: { title: true, progress: true } },
        donationOpportunity: { select: { title: true, progress: true } },
      }
    );

    doc.setData({
      donations: donations
        .filter((d) => d.paymentMethod !== "useBalance")
        .map((d) => {
          const status =
            d.donationType === "campaign"
              ? d.campaign?.progress?.rate === 100
                ? "مكتمل"
                : "غير مكتمل"
              : d.donationType === "donationOpportunity"
              ? d.donationOpportunity?.progress?.rate === 100
                ? "مكتمل"
                : "غير مكتمل"
              : "غير مكتمل";
          return {
            id: d.id,
            oppTitle:
              d.donationType === "campaign"
                ? d.campaign.title
                : d.donationType === "donationOpportunity"
                ? d.donationOpportunity.title
                : "",
            status: status,
            type: balanceTypeLabel[d.donationType],
            id: d.id,
            date: dayjs(d.createdAt).format("YYYY-MM-DD"),
            time: dayjs(d.createdAt).format("HH:mm:ss"),
            ...d,
          };
        }),
      createdAt: currentDate.format("YYYY-MM-DD"),
      from: dayjs(from).format("YYYY-MM-DD"),
      to: dayjs(to).format("YYYY-MM-DD"),
    });

    return generateBuffer(doc);
  } catch (error) {
    console.error("Error generating donations report:", error);
    throw new Error("Failed to generate donations report");
  }
}

module.exports = {
  getZakatRepport,
  getDonationOpportunitiesRepports,
  getCampaignsRepports,
  getUserBalanceRepports,
  getDonationsRepports,
};
