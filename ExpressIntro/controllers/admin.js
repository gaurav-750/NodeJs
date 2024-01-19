const Product = require("../models/product");

//* controller for get add product
exports.getAddProducts = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("[Controllers/Admin]: postAddProduct", req.body);
  const { title, imageUrl, price, description } = req.body;

  const newProduct = new Product(title, imageUrl, description, price);
  newProduct.save();

  res.redirect("/");
};

exports.getAllProducts = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    console.log("[Controllers/Admin]: getAllProducts", products.length);

    //rendering ejs file -> shop.pug
    res.render("admin/products", {
      prods: products, //passing data to ejs file
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
