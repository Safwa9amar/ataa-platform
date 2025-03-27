const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all comments for a specific charity
const getAllCommentsByCharityId = async (charityId) => {
  return await prisma.comment.findMany({
    where: {
      charity: {
        id: charityId,
      },
    },
    include: { createdByUser: true }, // Optionally include user details
    orderBy: {
      createdAt: "asc",
    },
  });
};

// Get a specific comment by ID
const getCommentById = async (id) => {
  return await prisma.comment.findUnique({
    where: { id: id },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          photo: true,
        },
      },
    }, // Optionally include user details
  });
};

// Create a new comment
const createComment = async (data) => {
  return await prisma.comment.create({
    data,
  });
};

// Update a comment by ID
const updateComment = async (id, data) => {
  return await prisma.comment.update({
    where: { id: id },
    data,
  });
};

// Delete a comment by ID
const deleteComment = async (id) => {
  return await prisma.comment.delete({
    where: { id: id },
  });
};

module.exports = {
  getAllCommentsByCharityId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
