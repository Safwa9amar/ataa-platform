// src/controllers/categoryController.js
const categoryService = require('../services/categoryService');

/**
 * Get all categories
 */
async function getAllCategories(req, res) {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
}

/**
 * Get category by ID
 */
async function getCategoryById(req, res) {
  const { id } = req.params;
  try {
    const category = await categoryService.getCategoryById(id);
    if (category) {
      res.status(200).json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error fetching category', error });
  }
}

/**
 * Create a new category
 */
async function createCategory(req, res) {
  const categoryData = req.body;
  try {
    const newCategory = await categoryService.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
}

/**
 * Update a category
 */
async function updateCategory(req, res) {
  const { id } = req.params;
  const categoryData = req.body;
  try {
    const updatedCategory = await categoryService.updateCategory(id, categoryData);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
}

/**
 * Delete a category
 */
async function deleteCategory(req, res) {
  const { id } = req.params;
  try {
    await categoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
