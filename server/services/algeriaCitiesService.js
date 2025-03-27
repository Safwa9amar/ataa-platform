// algeriaCitiesService.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllCities = async () => {
  return await prisma.algeriaCities.findMany();
};

const getWilayas = async () => {
  return await prisma.algeriaCities.findMany({
    select: {
      wilaya_code: true,
      wilaya_name: true,
      wilaya_name_ascii: true,
    },
    distinct: ["wilaya_name"],
  });
};

const getDairas = async (wilayaCode) => {
  return await prisma.algeriaCities.findMany({
    where: {
      wilaya_code: wilayaCode,
    },
    select: {
      daira_name: true,
      daira_name_ascii: true,
    },
    distinct: ["daira_name"],
  });
};

const getCommunes = async (dairaName) => {
  return await prisma.algeriaCities.findMany({
    where: {
      daira_name_ascii: dairaName,
    },
    select: {
      id: true,
      commune_name: true,
      commune_name_ascii: true,
    },
    distinct: ["commune_name"],
  });
};

const addCity = async (citiesData) => {
  return await prisma.algeriaCities.createMany({
    data: citiesData,
    skipDuplicates: true, // Optional: Skips duplicates based on the model's unique constraints
  });
};

module.exports = {
  getAllCities,
  getWilayas,
  getDairas,
  getCommunes,
  addCity,
};
