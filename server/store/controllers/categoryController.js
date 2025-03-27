const categoryService = require("../services/categoryService");

class CategoryController {
  async createCategory(req, res) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      await categoryService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController();
