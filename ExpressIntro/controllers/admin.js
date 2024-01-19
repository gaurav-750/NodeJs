const Product = require("../models/product");

//* controller for get add product
exports.getAddProducts = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  //   products.push({ title: req.body.title });
  const newProduct = new Product(req.body.title);
  newProduct.save();

  res.redirect("/");
};

exports.getAllProducts = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    console.log("products in getAllproducts=>", products.length);

    //rendering ejs file -> shop.pug
    res.render("admin/products", {
      prods: products, //passing data to ejs file
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
