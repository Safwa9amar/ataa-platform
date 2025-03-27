const prisma = require("../models/index");

// Service for fetching statistics
const fetchStatistics = async () => {
  try {
    // Fetch all donations
    const donations = await prisma.donation.findMany();
    const totalDonatedAmount = Number(
      donations.reduce((acc, item) => acc + item.amount, 0).toFixed(2)
    );

    // Placeholder for donation fields count (can be made dynamic in the future)
    const donationFields = 20; // TODO: Add "donation fields" to the database, such as opportunities or campaigns

    // Fetch completed opportunities with progress rate of 100%
    const completedOpportunities = await prisma.donationOpportunity.count({
      where: {
        progress: {
          rate: 100, // Fully completed
        },
      },
    });
    // Calculate the total number of beneficiaries
    const donationOPP = await prisma.donationOpportunity.findMany({
      select: {
        numOfBeneficiaries : true
      },
    });
    const campaigns = await prisma.campaign.findMany({
      select: {
        numOfBeneficiaries: true,
      },
    });
    // Use reduce to sum beneficiaries from both tables
    const totalNumberOfBeneficiaries = [...donationOPP, ...campaigns].reduce(
      (total, item) => total + (item.numOfBeneficiaries || 0),
      0
    );

    // Count remaining opportunities with progress rate less than 100%
    const remainingOpportunities = await prisma.donationOpportunity.count({
      where: {
        progress: {
          rate: { lt: 100 },
        },
      },
    });

    // Return aggregated statistics
    return {
      totalDonations: donations.length,
      totalDonatedAmount,
      totalNumberOfBeneficiaries,
      remainingOpportunities,
      completedOpportunities: completedOpportunities,
      donationFields,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error.message);
    throw new Error("Failed to fetch statistics. Please try again later.",error.message);
  }
};

module.exports = { fetchStatistics };
