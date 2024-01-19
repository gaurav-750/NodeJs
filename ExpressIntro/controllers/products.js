const products = [];

//* controller for get add product
exports.getAddProducts = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log(req.body);
  products.push({ title: req.body.title });

  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  //rendering ejs file -> shop.pug
  res.render("shop", {
    prods: products, //passing data to ejs file
    pageTitle: "Shop",
    path: "/",
  });
};
