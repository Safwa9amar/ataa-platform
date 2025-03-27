const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllGivingPartners = async () => {
  return await prisma.givingPartners.findMany();
};

const getGivingPartnerById = async (id) => {
  return await prisma.givingPartners.findUnique({ where: { id: id } });
};

const createGivingPartner = async (data) => {
  return await prisma.givingPartners.create({
    data,
  });
};

const updateGivingPartner = async (id, data) => {
  return await prisma.givingPartners.update({
    where: { id: id },
    data,
  });
};

const deleteGivingPartner = async (id) => {
  return await prisma.givingPartners.delete({ where: { id: id } });
};

module.exports = {
  getAllGivingPartners,
  getGivingPartnerById,
  createGivingPartner,
  updateGivingPartner,
  deleteGivingPartner,
};
