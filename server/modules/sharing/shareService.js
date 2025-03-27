const { PrismaClient, LinkType } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const firebaseAdmin = require("../../firebase");

// عدد النقاط لكل منصة
const PLATFORM_POINTS = {
  FACEBOOK: process.env.FACEBOOK || 5,
  TWITTER: process.env.TWITTER || 3,
  INSTAGRAM: process.env.INSTAGRAM || 4,
  LINKEDIN: process.env.LINKEDIN || 6,
  WHATSAPP: process.env.WHATSAPP || 2,
};

// إنشاء رابط مشاركة جديد
const createShareLink = async (userId, itemId, platform, type) => {
  if (!userId || !platform) {
    throw new Error("User ID and platform are required");
  }

  let user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (user.role !== "donor") {
    throw new Error("User role is not permitted to share this content");
  }

  const existingLink = await prisma.sharedLinks.findFirst({
    where: {
      userId,
      platform: String(platform).toUpperCase(),
      linkType: type,
      OR: [
        {
          donationOpportunityId:
            type === LinkType.donationOpportunity ? itemId : null,
        },
        { campaignId: type === LinkType.campaign ? itemId : null },
      ],
    },
  });

  if (existingLink) {
    return existingLink; // إذا كان الرابط موجودًا، فأعده مباشرة
  }

  // إنشاء رابط جديد إذا لم يكن موجودًا
  const uniqueLink = `${process.env.WEBSITE_URL}/share/${uuidv4()}`;
  const points = PLATFORM_POINTS[String(platform).toUpperCase()] || 1;
  try {
    await firebaseAdmin.messaging().sendEachForMulticast({
      tokens: user.fcmTokens.map((el) => el.token), // Send to multiple devices
      notification: {
        title: "سفراء عطاء",
        body: `لقد حصلت على ${points} نفاط في سفراء عطاء`,
      },
    });
  } catch (error) {
    console.log("firebase token error", error.message);
  }

  return await prisma.sharedLinks.create({
    data: {
      userId,
      donationOpportunityId:
        type === LinkType.donationOpportunity ? itemId : undefined,
      campaignId: type === LinkType.campaign ? itemId : undefined,
      platform: String(platform).toUpperCase(),
      linkType: type,
      uniqueLink,
      ambassadorPoints: Number(points),
    },
  });
};

const getShareById = async (linkuuid) => {
  const uniqueLink = `${process.env.WEBSITE_URL}/share/${linkuuid}`;

  return await prisma.sharedLinks.findUnique({
    where: {
      uniqueLink: uniqueLink,
    },
    include: {
      campaign: true,
      donationOpportunity: true,
    },
  });
};
module.exports = { createShareLink, getShareById };
