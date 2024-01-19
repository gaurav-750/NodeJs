const express = require("express");

const router = express.Router();
const productsController = require("../controllers/products");

//admin/add-product
router.get("/add-product", productsController.getAddProducts);

//admin/product
router.post("/add-product", productsController.postAddProduct);

module.exports = router;
