const Product = require("../models/product");

const { validationResult } = require("express-validator");
const { deleteFile } = require("../utils/file");

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
  const { title, price, description } = req.body;

  const image = req.file; //multer will add this to the request object
  console.log("[Controllers/Admin/postAddProduct]: image:", image);

  if (!image) {
    //that means multer declined the incoming file -> validation error
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",

      product: {
        title,
        price,
        description,
      },

      errorMessage: "Attached file is invalid! Please upload an image file.",
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("[Controllers/Admin/postAddProduct]: errors:", errors.array());
    return res.status(422).render("admin/add-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",

      product: {
        title,
        // imageUrl,
        price,
        description,
      },

      errorMessage: errors.array()[0].msg,
    });
  }

  const imageUrl = image.path;
  Product.create({
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
  const { title, price, description, productId } = req.body;

  const image = req.file; //multer will add this to the request object

  const errors = validationResult(req);
  console.log("[Controllers/Admin/postEditProduct]: errors:", errors.array());

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",

      product: {
        title,
        price,
        description,
        _id: productId,
      },

      errorMessage: errors.array()[0].msg,
    });
  }

  Product.findById(productId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }

      //if product exist
      product.title = title;
      product.price = price;
      product.description = description;

      if (image) {
        //means user has uploaded a new image
        //! deleting the old image from the file system
        deleteFile(product.imageUrl);

        product.imageUrl = image.path;
      }

      return product.save();
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

  Product.findById(productId)
    .then((product) => {
      if (!product) {
        return next(new Error("Product not found."));
      }

      //! deleting the product image from the file system
      deleteFile(product.imageUrl);

      //authorization -> we are also checking if the logged in user is the owner of the product
      return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
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
