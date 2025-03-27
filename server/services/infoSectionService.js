// src/services/infoSectionService.js
const prisma = require("../models");
/**
 * Get all InfoSections
 */
async function getAllInfoSections() {
  return await prisma.infoSection.findMany();
}

/**
 * Get an InfoSection by ID
 * @param {number} id - InfoSection ID
 */
async function getInfoSectionById(id) {
  return await prisma.infoSection.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new InfoSection
 * @param {object} sectionData - InfoSection data
 */
async function createInfoSection(sectionData) {
  return await prisma.infoSection.create({
    data: sectionData,
  });
}

/**
 * Update an InfoSection by ID
 * @param {number} id - InfoSection ID
 * @param {object} sectionData - InfoSection data
 */
async function updateInfoSection(id, sectionData) {
  return await prisma.infoSection.update({
    where: { id: parseInt(id, 10) },
    data: sectionData,
  });
}

/**
 * Delete an InfoSection by ID
 * @param {number} id - InfoSection ID
 */
async function deleteInfoSection(id) {
  return await prisma.infoSection.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllInfoSections,
  getInfoSectionById,
  createInfoSection,
  updateInfoSection,
  deleteInfoSection,
};
