// src/services/fieldService.js
const prisma = require("../models");

const getAllFields = async () => {
  return await prisma.field.findMany({
    include: {
      categories: true,
    },
  });
};

const getFieldById = async (id) => {
  return await prisma.field.findUnique({
    where: { id: id },
    include: {
      categories: {
        include: {
          Mosques: true,
          Orphans: true,
        },
      },
    },
  });
};

const createField = async (data) => {
  return await prisma.field.create({
    data,
  });
};

const updateField = async (id, data) => {
  return await prisma.field.update({
    where: { id: id },
    data,
  });
};

const deleteField = async (id) => {
  return await prisma.field.delete({
    where: { id: id },
  });
};

module.exports = {
  getAllFields,
  getFieldById,
  createField,
  updateField,
  deleteField,
};
