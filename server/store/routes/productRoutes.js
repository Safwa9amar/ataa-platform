const express = require("express");
const productController = require("../controllers/productController");
const router = express.Router();

router.post("/", productController.createProduct);
router.get(
  "/search/:id?/:page?/:limit?/:keywords?",
  productController.searchProductsInCategory
);
router.get("/:id", productController.getProductById);
router.get("/:page?/:limit?/:keywords?/", productController.getAllProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
