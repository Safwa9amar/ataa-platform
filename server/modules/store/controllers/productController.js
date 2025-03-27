const productService = require("../services/productService");

class ProductController {
  async createProduct(req, res) {
    const userID = req.user.id;
    try {
      const product = await productService.createProduct(req.body, userID);
      res.status(201).json(product);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  }
  async addStockToProduct(req, res) {
    const productId = req.body.productId;
    const quantityToAdd = req.body.quantityToAdd;
    const changeType = req.body.changeType;

    try {
      const product = await productService.addStockToProduct(
        productId,
        quantityToAdd,
        changeType
      );
      res.status(201).json(product);
    } catch (error) {
      console.log(error);

      res.status(500).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    const keywords = req.query.keywords;
    const page = req.query.page;
    const limit = req.query.limit;

    try {
      const products = await productService.getAllProducts(
        keywords,
        page,
        limit
      );
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
        req.query.id,
        req.query.keywords,
        req.query.page,
        req.query.limit
      );
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  //getMyProducts
  async getMyProducts(req, res) {
    const keywords = req.query.keywords;
    const page = req.query.page;
    const limit = req.query.limit;
    const userID = req.user.id;
    try {
      const products = await productService.getMyProducts(
        keywords,
        page,
        limit,
        userID
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

  async deleteMyProduct(req, res) {
    const userId = req.user.id;
    const productId = req.params.id;
    try {
      await productService.deleteMyProduct(productId, userId);
      res.status(204).send();
    } catch (error) {
      console.log(error);

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
