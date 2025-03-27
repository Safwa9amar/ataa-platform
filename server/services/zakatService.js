// zakatService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createZakat = async (data, email) => {
  //    find zakat by user email and check if zakat spend for this year
  let zakat = await prisma.zakat.findFirst({
    where: {
      AND: [
        { user: { email: email } },
        { createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) } },
      ],
    },
  });
  if (zakat) {
    throw new Error("Zakat already exists");
  }

  // connet user
  let user = await prisma.users.findUnique({
    where: { email: email },
  });
  if (!user) {
    throw new Error("User not found");
  }
  let currentYear = new Date().getFullYear();
  data.user = { connect: { id: user.id } };
  return await prisma.zakat.create({
    data: {
      ...data,
      year: currentYear,
    },
  });
};

const getZakatById = async (id) => {
  return await prisma.zakat.findUnique({
    where: { id },
    include: { user: true }, // Include the related user data if needed
  });
};

const getAllZakat = async () => {
  return await prisma.zakat.findMany({
    include: { user: true }, // Include the related user data if needed
  });
};

const updateZakat = async (id, zakatData) => {
  return await prisma.zakat.update({
    where: { id },
    data: zakatData,
  });
};

const deleteZakat = async (id) => {
  return await prisma.zakat.delete({
    where: { id },
  });
};

module.exports = {
  createZakat,
  getZakatById,
  getAllZakat,
  updateZakat,
  deleteZakat,
};
