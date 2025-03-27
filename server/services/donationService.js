// services/donationService.js

const prisma = require("../models");
// عدد النقاط لكل منصة
const PLATFORM_POINTS = {
  FACEBOOK: process.env.FACEBOOK || 5,
  TWITTER: process.env.TWITTER || 3,
  INSTAGRAM: process.env.INSTAGRAM || 4,
  LINKEDIN: process.env.LINKEDIN || 6,
  WHATSAPP: process.env.WHATSAPP || 2,
};

async function createDonation(data) {
  const {
    donationType,
    amount,
    screenShoot,
    donationTypeID,
    userId,
    paymentMethod,
    sharingSource,
  } = data;
  const sharedLink =
    sharingSource &&
    (await prisma.sharedLinks.findUnique({
      where: { uniqueLink: sharingSource },
    }));
  // Handle image upload if provided
  let screenShootId = null;
  if (screenShoot && screenShoot.length > 0) {
    const uploadedImage = await prisma.image.create({
      data: screenShoot[0],
    });
    screenShootId = uploadedImage.id;
  }

  // Prepare the donation data
  const donationData = {
    amount,
    donationType: donationType, // Default type
    cartData: data.cartData || null, // Optional field
    paymentMethod,
  };

  if (screenShoot) {
    donationData.screenShoot = screenShootId
      ? { connect: { id: screenShootId } }
      : null;
  }
  donationData.user = { connect: { id: userId } };

  // Handle relations based on IDs
  if (donationType === "donationOpportunity" || donationType === "store") {
    donationData.donationOpportunity = {
      connect: { id: donationTypeID },
    };

    let progress = await prisma.progress.findUnique({
      where: { donationOpportunityId: donationTypeID },
    });
    let newProgress =
      ((progress.totalAmount + amount) / progress.requiredAmount) * 100;
    await prisma.progress.update({
      where: {
        donationOpportunityId: donationTypeID,
      },
      data: {
        totalAmount: {
          increment: amount,
        },
        rate: {
          set: newProgress > 100 ? 100 : newProgress,
        },
      },
    });
    const donationOpportunity = await prisma.donationOpportunity.update({
      where: { id: donationTypeID },
      data: {
        lastDonation: new Date(),
        donationCount: {
          increment: 1,
        },
        endAt: newProgress === 100 ? new Date() : null,
      },
    });

    if (
      sharedLink &&
      sharedLink.donationOpportunityId === donationOpportunity.id
    ) {
      const points = PLATFORM_POINTS[sharedLink.platform] || 1;

      // احتساب النقاط الجديدة من التبرع
      const donationPoints = Math.floor(points * 0.5);
      const totalPoints = sharedLink.donationPoints + donationPoints;
      await prisma.ambassadorPoints.create({
        data: {
          userId: sharedLink.userId,
          totalPoints: totalPoints,
        },
      });

      // تحديث الرابط وزيادة عدد التبرعات
      await prisma.sharedLinks.update({
        where: { id: sharedLink.id },
        data: {
          donationCount: { increment: 1 },
          donationPoints: totalPoints,
        },
      });
    }
  }

  if (donationType === "campaign") {
    donationData.campaign = {
      connect: { id: donationTypeID },
    };
    let campaign = await prisma.campaign.findUnique({
      where: { id: donationTypeID },
    });
    let progress = await prisma.progress.findUnique({
      where: { campaignId: donationTypeID },
    });

    let isGOODS = campaign.CampaignType === "GOODS";
    let unitPrice = campaign.unitPrice;
    let newAmount = isGOODS ? amount / unitPrice : amount;
    let totalunits = progress.totalAmount / unitPrice + newAmount;

    let newProgress =
      ((progress.totalAmount + amount) / progress.requiredAmount) * 100;
    await prisma.progress.update({
      where: {
        campaignId: donationTypeID,
      },
      data: {
        totalAmount: {
          increment: amount,
        },
        rate: {
          set:
            campaign.campaignStatus !== "ONGOING"
              ? newProgress > 100
                ? 100
                : newProgress
              : 0,
        },
      },
    });
    let updatedCampagin = await prisma.campaign.update({
      where: { id: donationTypeID },
      data: {
        lastDonation: new Date(),
        donationCount: {
          increment: 1,
        },
        donatedUnits: {
          set: isGOODS ? totalunits : 0,
        },
        endAt: newProgress === 100 ? new Date() : null,
      },
    });
    if (sharedLink && sharedLink.campaignId === updatedCampagin.id) {
      const points = PLATFORM_POINTS[sharedLink.platform] || 1;

      // احتساب النقاط الجديدة من التبرع
      const donationPoints = Math.floor(points * 0.5);
      const totalPoints = sharedLink.donationPoints + donationPoints;

      // تحديث الرابط وزيادة عدد التبرعات
      await prisma.sharedLinks.update({
        where: { id: sharedLink.id },
        data: {
          donationCount: { increment: 1 },
          donationPoints: totalPoints,
        },
      });
    }
  }

  if (donationType === "cart") {
    donationData.cartData = JSON.stringify(data.cartData);
  }

  // edit user current balance after donation
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });
  donationData.remainingAmount =
    paymentMethod === "useBalance"
      ? user.currentBalance - amount
      : user.currentBalance;

  paymentMethod === "usePoints"
    ? user.ambassadorRank - amount
    : user.ambassadorRank;

  donationData.usedBalance =
    paymentMethod === "useBalance"
      ? user.currentBalance
      : paymentMethod === "usePoints"
      ? user.ambassadorRank
      : 0;
  // donationData.usedPoints = user.ambassadorRank;

  await prisma.users.update({
    where: { id: userId },
    data: {
      currentBalance: donationData.remainingAmount,
      ambassadorRank:
        paymentMethod === "usePoints"
          ? user.ambassadorRank - amount
          : user.ambassadorRank,
      numberOfDonations: user.numberOfDonations + 1,
      totalDonatedAmount: user.totalDonatedAmount + amount,
    },
  });
  const date = new Date();
  const month = date.getMonth() + 1; // JavaScript months are 0-11
  donationData.quarter = Math.ceil(month / 3);
  // Create the donation record
  return await prisma.donation.create({
    data: donationData,
  });
}

async function getDonations() {
  return await prisma.donation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      donationOpportunity: true,
      campaign: true,
      product: true,
      user: true,
    },
  });
}

async function getDonationById(id, isUniqueVisitor) {
  if (isUniqueVisitor) {
    await prisma.donationOpportunity.update({
      where: { id },
      data: {
        visits: {
          increment: 1,
        },
      },
    });
  }
  return await prisma.donation.findUnique({
    where: { id },
    include: {
      donationOpportunity: true,
      campaign: true,
      product: true,
      user: true,
    },
  });
}

async function updateDonation(id, data) {
  return await prisma.donation.update({
    where: { id },
    data,
  });
}

async function deleteDonation(id) {
  return await prisma.donation.delete({
    where: { id },
  });
}

module.exports = {
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};
