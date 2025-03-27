// src/services/imageService.js
const prisma = require("../models");
/**
 * Get all images
 */
async function getAllFiles() {
  return await prisma.file.findMany();
}

/**
 * Get an file by ID
 * @param {number} id - file ID
 */
async function getFileById(id) {
  return await prisma.file.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new file
 * @param {object} file - file data
 */
async function createFile(file) {
  return await prisma.file.create({
    data: file,
  });
}

/**
 * Update an file by ID
 * @param {number} id - file ID
 * @param {object} file - file data
 */
async function updateFile(id, file) {
  return await prisma.file.update({
    where: { id: parseInt(id, 10) },
    data: file,
  });
}

/**
 * Delete an file by ID
 * @param {number} id - file ID
 */
async function deleteFile(id) {
  return await prisma.file.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllFiles,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
};
