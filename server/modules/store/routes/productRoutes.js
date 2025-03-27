const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authenticate = require("../../../middlewares/authMiddleware");
const authorize = require("../../../middlewares/authorizeMiddleware");
const { body, param, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

router.use(limiter);

// Search products
router.get("/search", productController.searchProductsInCategory);

// Get all products with pagination and filtering
router.get("/", productController.getAllProducts);

// Get a single product by ID by query not params

// get my products
router.get(
  "/my-products",
  authenticate,
  authorize(["admin", "partner"]),
  productController.getMyProducts
);
// Create a new product
router.get("/:id", productController.getProductById);

router.post(
  "/",
  authenticate,
  authorize(["admin", "partner"]),
  [
    // التحقق من الحقول المطلوبة
    body("name").notEmpty().withMessage("Name is required"), // اسم المنتج
    body("category").notEmpty().withMessage("Category is required"), // فئة المنتج
    body("description").notEmpty().withMessage("Description is required"), // وصف المنتج
    body("price")
      .isNumeric()
      .withMessage("Price must be a number")
      .notEmpty()
      .withMessage("Price is required"), // سعر المنتج
    body("quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be a non-negative integer")
      .notEmpty()
      .withMessage("Quantity is required"), // الكمية المتاحة

    body("productImages")
      .isArray({ min: 1 })
      .withMessage("At least one product image is required"), // صور المنتج
  ],
  (req, res, next) => {
    // التحقق من الأخطاء
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);

      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  productController.createProduct
);
router.patch(
  "/",
  authenticate,
  authorize(["admin", "partner"]),
  [
    // التحقق من الحقول المطلوبة
    body("productId").notEmpty().withMessage("productId is required"), // اسم المنتج
    body("quantityToAdd").notEmpty().withMessage("quantityToAdd is required"), // فئة المنتج
  ],
  (req, res, next) => {
    // التحقق من الأخطاء
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  productController.addStockToProduct
);

// Update a product
router.put(
  "/:id",
  authenticate,
  authorize(["admin", "partner"]),
  productController.updateProduct
);

// Delete a product

router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "partner"]),
  productController.deleteMyProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  productController.deleteProduct
);
// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = router;
