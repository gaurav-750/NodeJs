const express = require("express");

const router = express.Router();
const adminController = require("../controllers/admin");

//admin/add-product
router.get("/add-product", adminController.getAddProducts);

//admin/product
router.post("/add-product", adminController.postAddProduct);

router.get("/products", adminController.getAllProducts);

// //admin/edit-product/123
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post("/edit-product", adminController.postEditProduct);

// //* Delete
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
