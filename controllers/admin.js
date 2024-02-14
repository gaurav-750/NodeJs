const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAllProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select("title price -_id")
    // .populate("userId")
    .then((products) => {
      // console.log("products => ", products);

      res.render("admin/products", {
        prods: products, //passing data to ejs file
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Admin/getAllProducts] err:", err);
      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

// //* controller for get add product
exports.getAddProducts = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    product: {},
    errorMessage: "",
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log("[Controllers/Admin/postAddProduct]: req.body", req.body);
  const { title, imageUrl, price, description } = req.body;

  const errors = validationResult(req);
  console.log("[Controllers/Admin/postAddProduct]: errors:", errors);

  if (!errors.isEmpty()) {
    res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",

      product: {
        title,
        imageUrl,
        price,
        description,
      },

      errorMessage: errors.array()[0].msg,
    });
  }

  Product.create({
    _id: "ffa",
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id,
  })
    .then((result) => {
      console.log("[Controllers/Admin/postAddProduct]: Created Product ");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("err in postAddProduct:", err);
      // res.redirect("/500");

      const error = new Error(err);
      err.statusCode = 500;
      return next(error); //this will skip all the middlewares and directly go to the error handling middleware
    });
};

exports.getEditProduct = (req, res, next) => {
  console.log("[Controllers/Admin/getEditProduct] req.query:", req.query);
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      //if product exist
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode,
        product,
        errorMessage: "",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Admin/getEditProduct] err:", err);

      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  console.log("[Controllers/Admin/postEditProduct] req.body:", req.body);
  const { title, imageUrl, price, description, productId } = req.body;

  const errors = validationResult(req);
  console.log("[Controllers/Admin/postEditProduct]: errors:", errors.array());

  if (!errors.isEmpty()) {
    res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",

      product: {
        title,
        imageUrl,
        price,
        description,
        _id: productId,
      },

      errorMessage: errors.array()[0].msg,
    });
  }

  // const { productId } = req.body;
  Product.findByIdAndUpdate(productId, {
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
  })
    .then((result) => {
      console.log("[Controllers/Admin/postEditProduct] Product Updated.");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("[Controllers/Admin/postEditProduct] err:", err);

      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  console.log("[Controllers/Admin/postDeleteProduct] req.body:", req.body);
  const { productId } = req.body;

  //authorization -> we are also checking if the logged in user is the owner of the product
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then((result) => {
      if (result.deletedCount !== 0) {
        console.log(
          "[Controllers/Admin/postDeleteProduct] Product Deleted.",
          result
        );
      }
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("[Controllers/Admin/postDeleteProduct] err:", err);

      const error = new Error(err);
      err.statusCode = 500;
      return next(error);
    });
};
