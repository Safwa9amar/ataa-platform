const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all charity associations
const getAllCharityAssociations = async () => {
  return await prisma.charityAssociation.findMany({
    include: { comments: true, likes: true }, // Include related comments
  });
};

// Get a specific charity association by ID
const getCharityAssociationById = async (id) => {
  return await prisma.charityAssociation.findUnique({
    where: { id: id },
    include: { comments: true, likes: true }, // Include related comments
  });
};

// Create a new charity association
const createCharityAssociation = async (data) => {
  return await prisma.charityAssociation.create({
    data,
  });
};

// Update a charity association by ID
const updateCharityAssociation = async (id, data) => {
  return await prisma.charityAssociation.update({
    where: { id: id },
    data,
  });
};

// Delete a charity association by ID
const deleteCharityAssociation = async (id) => {
  return await prisma.charityAssociation.delete({
    where: { id: id },
  });
};

module.exports = {
  getAllCharityAssociations,
  getCharityAssociationById,
  createCharityAssociation,
  updateCharityAssociation,
  deleteCharityAssociation,
};
