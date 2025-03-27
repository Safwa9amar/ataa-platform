const express = require("express");
const productRoutes = require("../modules/store/routes/productRoutes");
const categoryRoutes = require("../modules/store/routes/categoryRoutes");

const router = express.Router();

router.use("/store/products", productRoutes);
router.use("/store/categories", categoryRoutes);

module.exports = router;
