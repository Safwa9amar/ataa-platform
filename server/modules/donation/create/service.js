const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const firebaseAdmin = require("../../../firebase");

// عدد النقاط لكل منصة
const PLATFORM_POINTS = {
  FACEBOOK: process.env.FACEBOOK || 5,
  TWITTER: process.env.TWITTER || 3,
  INSTAGRAM: process.env.INSTAGRAM || 4,
  LINKEDIN: process.env.LINKEDIN || 6,
  WHATSAPP: process.env.WHATSAPP || 2,
};

/**
 * Creates a donation record with comprehensive processing including:
 * - Input validation
 * - User verification
 * - Shared link processing (for ambassador programs)
 * - Image handling
 * - Donation opportunity/campaign processing
 * - Balance updates
 * - Progress tracking
 * - Notification sending
 */
async function createDonation(data) {
  // --- Input Validation ---
  // Check if data exists and is an object
  if (!data || typeof data !== "object") throw new Error("Invalid data");

  // Destructure required fields from input data
  const {
    donationType,
    amount,
    screenShoot,
    donationTypeID,
    userId,
    paymentMethod,
    sharingSource,
    cartData,
  } = data;

  // Validate required fields
  if (!donationType || !amount || !userId) {
    throw new Error("Missing required donation details.");
  }

  // Validate donation amount is positive
  if (amount <= 0) throw new Error("Invalid donation amount.");

  // --- User Verification ---
  // Fetch user with selected fields for donation processing
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: {
      id: true,
      currentBalance: true,
      numberOfDonations: true,
      totalDonatedAmount: true,
      fcmTokens: true, // For potential notifications
    },
  });
  if (!user) throw new Error("User not found.");

  // --- Shared Link Processing ---
  // Handle shared links (for ambassador/referral programs)
  let sharedLink = null;
  if (sharingSource) {
    sharedLink = await prisma.sharedLinks.findUnique({
      where: { uniqueLink: sharingSource },
      select: {
        id: true,
        userId: true,
        donationPoints: true,
        platform: true,
        donationOpportunityId: true,
        campaignId: true,
      },
    });
  }

  // --- Image Handling ---
  // Process donation screenshot if provided
  let screenShootId = null;
  if (screenShoot) {
    const uploadedImage = await prisma.image.create({
      data: screenShoot,
    });
    screenShootId = uploadedImage.id;
  }

  // --- Donation Data Preparation ---
  // Base donation data structure
  const donationData = {
    amount,
    donationType,
    paymentMethod,
    cartData: cartData ? cartData : null, // Handle cart data if exists
  };
  donationData.user = { connect: { id: userId } };

  // --- Donation Opportunity/Store Processing ---
  if (["donationOpportunity", "store"].includes(donationType)) {
    if (!donationTypeID) throw new Error("Invalid donation opportunity ID.");

    // Connect donation to opportunity
    donationData.donationOpportunity = { connect: { id: donationTypeID } };

    // Get progress information for the opportunity
    const progress = await prisma.progress.findUnique({
      where: { donationOpportunityId: donationTypeID },
      select: { totalAmount: true, requiredAmount: true },
    });
    if (!progress) throw new Error("Donation opportunity progress not found.");

    // Check if donation exceeds required amount
    if (progress.totalAmount + amount > progress.requiredAmount) {
      throw new Error("Donation exceeds required amount for this opportunity.");
    }
    // check if active
    if (!donationData.donationOpportunity.status === "ACTIVE") {
      throw new Error("Donation opportunity is not active.");
    }

    // Calculate new progress percentage (capped at 100%)
    const newProgress = Math.min(
      ((progress.totalAmount + amount) / progress.requiredAmount) * 100,
      100
    );

    // Update progress record
    await prisma.progress.update({
      where: { donationOpportunityId: donationTypeID },
      data: {
        totalAmount: { increment: amount },
        rate: { set: newProgress },
      },
    });

    // Update opportunity metadata
    const donationOpportunity = await prisma.donationOpportunity.update({
      where: { id: donationTypeID },
      data: {
        lastDonation: new Date(),
        donationCount: { increment: 1 },
        endAt: newProgress === 100 ? new Date() : null, // Mark as completed if 100%
        status : newProgress === 100 ? "COMPLETED" : "ACTIVE",
      },
    });

    // --- Ambassador Program Handling ---
    // If donation came through a shared link, process ambassador points
    if (sharedLink?.donationOpportunityId === donationOpportunity.id) {
      const points = PLATFORM_POINTS[sharedLink.platform] || 1; // Get platform-specific points
      const donationPoints = Math.floor(points * 0.5); // Calculate points for this donation
      const totalPoints = sharedLink.donationPoints + donationPoints; // New total points

      // Update shared link record
      let sharedlink = await prisma.sharedLinks.update({
        where: { id: sharedLink.id },
        data: {
          donationCount: { increment: 1 },
          donationPoints: totalPoints,
        },
        include: {
          user: {
            include: {
              fcmTokens: true, // Include FCM tokens for notification
            },
          },
        },
      });

      // Create ambassador points record
      await prisma.ambassadorPoints.create({
        data: { userId: sharedLink.userId, totalPoints: donationPoints },
      });

      // Send notification to ambassador
      try {
        await firebaseAdmin.messaging().sendEachForMulticast({
          tokens: sharedlink.user.fcmTokens.map((el) => el.token),
          notification: {
            title: "سفراء عطاء",
            body: `لقد حصلت على ${donationPoints} نقاط في سفراء عطاء`,
          },
        });
      } catch (error) {
        console.log("firebase token error", error.message);
      }
    }
  }

  // --- Campaign Processing ---
  if (donationType === "campaign") {
    if (!donationTypeID) throw new Error("Invalid campaign ID.");

    // Connect donation to campaign
    donationData.campaign = { connect: { id: donationTypeID } };

    // Get campaign details
    const campaign = await prisma.campaign.findUnique({
      where: { id: donationTypeID },
      select: { campaignStatus: true, CampaignType: true, unitPrice: true },
    });
    if (!campaign) throw new Error("Campaign not found.");

    // Get campaign progress
    const progress = await prisma.progress.findUnique({
      where: { campaignId: donationTypeID },
      select: { totalAmount: true, requiredAmount: true },
    });

    // Check if donation exceeds required amount
    if (progress.totalAmount + amount > progress.requiredAmount) {
      throw new Error("Donation exceeds required amount for this campaign.");
    }

    // Handle GOODS type campaigns differently (calculate units)
    const isGOODS = campaign.CampaignType === "GOODS";
    const unitPrice = campaign.unitPrice || 1;
    const newAmount = isGOODS ? amount / unitPrice : amount;
    const totalUnits = progress.totalAmount / unitPrice + newAmount;

    // Calculate new progress percentage
    const newProgress = Math.min(
      ((progress.totalAmount + amount) / progress.requiredAmount) * 100,
      100
    );

    // Update campaign progress
    await prisma.progress.update({
      where: { campaignId: donationTypeID },
      data: {
        totalAmount: { increment: amount },
        rate: campaign.campaignStatus !== "ONGOING" ? newProgress : 0,
      },
    });

    // Update campaign metadata
    await prisma.campaign.update({
      where: { id: donationTypeID },
      data: {
        lastDonation: new Date(),
        donationCount: { increment: 1 },
        donatedUnits: isGOODS ? totalUnits : 0,
        endAt: newProgress === 100 ? new Date() : null, // Mark as completed if 100%
      },
    });

    // --- Ambassador Program Handling for Campaign ---
    if (sharedLink === campaign.id) {
      const points = PLATFORM_POINTS[sharedLink.platform] || 1;
      const donationPoints = Math.floor(points * 0.5);
      const totalPoints = sharedLink.donationPoints + donationPoints;

      let sharedlink = await prisma.sharedLinks.update({
        where: { id: sharedLink.id },
        data: {
          donationCount: { increment: 1 },
          donationPoints: totalPoints,
        },
        include: {
          user: {
            include: {
              fcmTokens: true,
            },
          },
        },
      });
      await prisma.ambassadorPoints.create({
        data: { userId: sharedLink.userId, totalPoints: donationPoints },
      });
      try {
        await firebaseAdmin.messaging().sendEachForMulticast({
          tokens: sharedlink.user.fcmTokens.map((el) => el.token),
          notification: {
            title: "سفراء عطاء",
            body: `لقد حصلت على ${totalPoints} نقاط في سفراء عطاء`,
          },
        });
      } catch (error) {
        console.log("firebase token error", error.message);
      }
    }
  }

  // --- User Balance Processing ---
  let remainingAmount = user.currentBalance;
  if (paymentMethod === "useBalance") {
    if (user.currentBalance < amount) throw new Error("Insufficient balance.");
    remainingAmount = user.currentBalance - amount;
  }

  // Update user's donation stats and balance
  await prisma.users.update({
    where: { id: userId },
    data: {
      currentBalance: remainingAmount,
      numberOfDonations: { increment: 1 },
      totalDonatedAmount: { increment: amount },
    },
  });

  // --- Additional Donation Metadata ---
  // Set quarter based on current month
  const month = new Date().getMonth() + 1;
  donationData.quarter = Math.ceil(month / 3);
  donationData.remainingAmount = remainingAmount;
  donationData.usedBalance = user.currentBalance;

  // --- Final Donation Creation ---
  // Create and return the donation record
  return await prisma.donation.create({
    data: {
      ...donationData,
      user: {
        connect: {
          id: userId,
        },
      },
      // screenShoot: screenShootId ? { connect: { id: screenShootId } } : null,
    },
  });
}
module.exports = createDonation;
