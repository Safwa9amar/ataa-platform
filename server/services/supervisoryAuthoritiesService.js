const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllSupervisoryAuthorities = async () => {
  return await prisma.supervisoryAuthorities.findMany();
};

const getSupervisoryAuthorityById = async (id) => {
  return await prisma.supervisoryAuthorities.findUnique({ where: { id: id } });
};

const createSupervisoryAuthority = async (data) => {
  return await prisma.supervisoryAuthorities.create({
    data,
  });
};

const updateSupervisoryAuthority = async (id, data) => {
  return await prisma.supervisoryAuthorities.update({
    where: { id: id },
    data,
  });
};

const deleteSupervisoryAuthority = async (id) => {
  return await prisma.supervisoryAuthorities.delete({ where: { id: id } });
};

module.exports = {
  getAllSupervisoryAuthorities,
  getSupervisoryAuthorityById,
  createSupervisoryAuthority,
  updateSupervisoryAuthority,
  deleteSupervisoryAuthority,
};
