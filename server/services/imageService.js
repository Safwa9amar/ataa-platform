// src/services/imageService.js
const prisma = require("../models");
/**
 * Get all images
 */
async function getAllImages() {
  return await prisma.image.findMany();
}

/**
 * Get an image by ID
 * @param {number} id - Image ID
 */
async function getImageById(id) {
  return await prisma.image.findUnique({
    where: { id: parseInt(id, 10) },
  });
}

/**
 * Create a new image
 * @param {object} imageData - Image data
 */
async function createImage(imageData) {
  return await prisma.image.create({
    data: imageData,
  });
}

/**
 * Update an image by ID
 * @param {number} id - Image ID
 * @param {object} imageData - Image data
 */
async function updateImage(id, imageData) {
  return await prisma.image.update({
    where: { id: parseInt(id, 10) },
    data: imageData,
  });
}

/**
 * Delete an image by ID
 * @param {number} id - Image ID
 */
async function deleteImage(id) {
  return await prisma.image.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
};
