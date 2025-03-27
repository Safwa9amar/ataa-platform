// src/services/likeService.js
const prisma = require("../models");

// Create a new like
async function createLike(charityId, userMail) {
  const user = await prisma.users.findUnique({
    where: { email: userMail.email },
  });
  const userId = user.id;

  try {
    const like = await prisma.like.create({
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

    return like;
  } catch (error) {
    throw new Error("Failed to create like");
  }
}

// Get all likes for a specific charity
async function getLikesByCharity(charityId) {
  try {
    const likes = await prisma.like.findMany({
      where: { charityId: charityId },
    });
    return likes;
  } catch (error) {
    throw new Error("Failed to fetch likes");
  }
}

// Delete a like by ID
async function deleteLike(id) {
  try {
    const like = await prisma.like.delete({
      where: { id: id },
    });
    return like;
  } catch (error) {
    throw new Error("Failed to delete like");
  }
}

module.exports = {
  createLike,
  getLikesByCharity,
  deleteLike,
};
// src/controllers/likeController.js
