// middleware/authMiddleware.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uniqueVisitorMiddlewareForCampaigns = async (req, res, next) => {
  const { id } = req.params;
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.useragent.source;

  try {
    // Check if the visit is already logged
    const campaign = await prisma.campaign.findUnique({
      where: { id: id },
      include: {
        visits: true,
      },
    });
    const existingVisit = campaign?.visits?.find(
      (visit) => visit.ipAddress === ipAddress && visit.userAgent === userAgent
    );

    if (!existingVisit) {
      // Log the new visit and set isUniqueVisitor to true
      await prisma.visit.create({
        data: {
          ipAddress,
          userAgent,
          campaign: {
            connect: {
              id: id,
            },
          },
        },
      });
      req.body.isUniqueVisitor = true; // Set the flag for unique visit
      console.log("New visit recorded.");
    } else {
      req.body.isUniqueVisitor = false; // Visitor is not unique
      console.log("Returning visitor detected.");
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error checking visit:", error);
    res.status(500).send("An error occurred.");
  }
};
const uniqueVisitorMiddlewareForOppertunities = async (req, res, next) => {
  const { id } = req.params;
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.useragent.source;

  try {
    // Check if the visit is already logged
    const donationOppertunity = await prisma.donationOpportunity.findUnique({
      where: { id: id },
      include: {
        visits: true,
      },
    });

    const existingVisit = donationOppertunity?.visits?.find(
      (visit) => visit.ipAddress === ipAddress && visit.userAgent === userAgent
    );
    if (!existingVisit) {
      // Log the new visit and set isUniqueVisitor to true
      await prisma.visit.create({
        data: {
          ipAddress,
          userAgent,
          donationOppertunity: {
            connect: {
              id: id,
            },
          },
        },
      });
      req.body.isUniqueVisitor = true; // Set the flag for unique visit
      console.log("New visit recorded.");
    } else {
      req.body.isUniqueVisitor = false; // Visitor is not unique
      console.log("Returning visitor detected.");
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error checking visit:", error);
    res.status(500).send("An error occurred.");
  }
};
module.exports = {
  uniqueVisitorMiddlewareForCampaigns,
  uniqueVisitorMiddlewareForOppertunities,
};
