// src/services/likeService.js
const prisma = require("../../../models");

// Create a new share
async function createShare(charityId, userMail) {
  const user = await prisma.users.findUnique({
    where: { email: userMail.email },
  });
  const userId = user.id;

  try {
    const share = await prisma.charityShares.create({
      data: {
        charity: {
          connect: {
            id: charityId,
          },
        },
        createdByUser: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return share;
  } catch (error) {
    console.log(error);

    throw new Error("Failed to create share");
  }
}

// Get all share for a specific charity
async function getSharesByCharity(charityId) {
  try {
    const share = await prisma.charityShares.findMany({
      where: { charityId: charityId },
    });
    return share;
  } catch (error) {
    throw new Error("Failed to fetch share");
  }
}

// Delete a share by ID
async function deleteShare(id) {
  try {
    const share = await prisma.charityShares.delete({
      where: { id: id },
    });
    return share;
  } catch (error) {
    throw new Error("Failed to delete share");
  }
}

module.exports = {
  createShare,
  getSharesByCharity,
  deleteShare,
};
// src/controllers/likeController.js
