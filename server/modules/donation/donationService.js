// services/donationService.js

const prisma = require("../../models");

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
  getDonations,
  getDonationById,
  updateDonation,
  deleteDonation,
};
