const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const adminController = require("../controllers/admin");
// const isAuthenticated = require("../middleware/is-authenticated");

//admin/add-product
router.get("/add-product", adminController.getAddProducts);

//admin/product
router.post(
  "/add-product",
  [
    check("title").isString().isLength({ min: 3 }).trim(),
    check("imageUrl").isURL(),
    check("price").isFloat(),
    check("description").isLength({ min: 5, max: 300 }).trim(),
  ],
  adminController.postAddProduct
);

router.get("/products", adminController.getAllProducts);

//admin/edit-product/123
router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    check("title").isString().isLength({ min: 3 }).trim(),
    check("imageUrl").isURL(),
    check("price").isFloat(),
    check("description").isLength({ min: 5, max: 300 }).trim(),
  ],
  adminController.postEditProduct
);

// * Delete
router.post("/delete-product", adminController.postDeleteProduct);

module.exports = router;
