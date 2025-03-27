const productService = require("../services/productService");

class ProductController {
  async createProduct(req, res) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    const keywords = req.params.keywords;
    const page = req.params.page
    const limit = req.params.limit
    try {
      const products = await productService.getAllProducts(keywords, page, limit);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async searchProductsInCategory(req, res) {
    try {
      const products = await productService.searchProductsInCategory(
        req.params.id,
        req.params.keywords,
        req.params.page,
        req.params.limit
      );
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      await productService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
