// src/services/categoryService.js
const prisma = require("../models");

/**
 * Get all categories
 */
async function getAllCategories() {
  return await prisma.category.findMany();
}

/**
 * Get a category by ID
 * @param {number} id - Category ID
 */
async function getCategoryById(id) {
  return await prisma.category.findUnique({
    where: { id: id },
  });
}

/**
 * Create a new category
 * @param {object} categoryData - Category data
 */
async function createCategory(categoryData) {
  return await prisma.category.create({
    data: categoryData,
  });
}

/**
 * Update a category by ID
 * @param {number} id - Category ID
 * @param {object} categoryData - Category data
 */
async function updateCategory(id, categoryData) {
  return await prisma.category.update({
    where: { id: parseInt(id, 10) },
    data: categoryData,
  });
}

/**
 * Delete a category by ID
 * @param {number} id - Category ID
 */
async function deleteCategory(id) {
  return await prisma.category.delete({
    where: { id: parseInt(id, 10) },
  });
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
