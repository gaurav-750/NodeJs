const express = require("express");

const router = express.Router();
const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductDetail); //* dynamic route

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.addToCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);

//order
router.post("/create-order", shopController.createOrder);
router.get("/orders", shopController.getOrders);

module.exports = router;