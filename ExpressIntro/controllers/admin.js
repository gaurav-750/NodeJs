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

  const newProduct = new Product(null, title, imageUrl, description, price);
  newProduct.save();

  res.redirect("/");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const { productId } = req.params;
  Product.findProductById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }

    //if product exist
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editMode,
      product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  //update the existing product
  const productId = req.body.productId;
  const { title, imageUrl, price, description } = req.body;

  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );

  updatedProduct.save();
  res.redirect("/admin/products");
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
