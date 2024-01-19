const Product = require("../models/product");
// const products = [];

exports.getIndex = (req, res, next) => {
  //
  Product.fetchAllProducts((products) => {
    //
    //rendering ejs file -> shop.pug
    res.render("shop/index", {
      prods: products, //passing data to ejs file
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    console.log("products in getproducts=>", products.length);

    //rendering ejs file -> shop.pug
    res.render("shop/product-list", {
      prods: products, //passing data to ejs file
      pageTitle: "All Products",
      path: "/products",
    });
  });
};

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
