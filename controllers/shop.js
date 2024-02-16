const Order = require("../models/order");
const Product = require("../models/product");

const path = require("path");
const fs = require("fs");

const PDFDocument = require("pdfkit");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getIndex] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getProducts] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.getProductDetail = (req, res, next) => {
  console.log("[Controllers/Shop/getProductDetail] req.params:", req.params);
  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      console.log("[Controllers/Shop/getProductDetail] product:", product);

      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getProductDetail] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

//! CART
exports.getCart = (req, res, next) => {
  //
  console.log(req.user);
  req.user.populate("cart.items.productId").then((user) => {
    console.log("[Controllers/Shop/getCart] products:", user.cart.items);

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: user.cart.items,
    });
  });
};

//add products to Cart
exports.addToCart = (req, res, next) => {
  console.log("[Controllers/Shop/addToCart] req.body:", req.body);
  const { productId } = req.body;

  console.log("[Controllers/Shop/addToCart] User:", req.user);
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("[Controllers/Shop/addToCart] result:", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/addToCart] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log("[Controllers/Shop/postCartDeleteProduct] req.body:", req.body);
  const { productId } = req.body;

  // User
  req.user
    .deleteItemFromCart(productId)
    .then((result) => {
      console.log("[Controllers/Shop/postCartDeleteProduct] result:", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/postCartDeleteProduct] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  //get all the orders of the user

  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      console.log("[Controllers/Shop/getOrders] orders:", orders);

      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getOrders] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.createOrder = (req, res, next) => {
  //
  console.log("[Controllers/Shop/createOrder] req.user:", req.user);
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return {
          quantity: i.quantity,
          product: {
            ...i.productId._doc,
          },
        };
      });

      //create order
      return Order.create({
        products: products,
        user: {
          email: req.user.email,
          userId: req.user._id,
        },
      });
    })
    .then((result) => {
      console.log("[Controllers/Shop/createOrder] result:", result);

      //clear the cart
      req.user.cart = { items: [] };
      req.user.save();

      res.redirect("/orders");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/createOrder] err:", err);

      const error = new Error(err);
      error.statusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  const invoiceName = `invoice-${orderId}.pdf`;
  const invoicePath = path.join("data", "invoices", invoiceName);

  //We also need to validate if the user is the owner of the order -> only he can access the invoice
  Order.findById(orderId).then((order) => {
    if (!order) {
      return next(new Error("No Order Found!"));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("You r unauthorized to view this invoice!"));
    }

    const pdfDoc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);

    //* streaming the data into the file
    pdfDoc.pipe(fs.createWriteStream(invoicePath));

    //add data to pdf
    pdfDoc.font("Helvetica-Bold").fontSize(26).text("Invoice");

    pdfDoc.text("--------------------------------------------------");

    let totalPrice = 0;
    order.products.forEach((prod) => {
      totalPrice += prod.quantity * prod.product.price;
      pdfDoc
        .font("Helvetica")
        .fontSize(16)
        .text(
          `${prod.product.title} - ${prod.quantity} x $${prod.product.price} `
        );
    });

    pdfDoc.text();
    pdfDoc.fontSize(20).text(`Total Price: $${totalPrice}`);

    //streaming the data to the client
    pdfDoc.pipe(res);
    pdfDoc.end();

    //? else reading the file and sending it
    // fs.readFile(invoicePath, (err, data) => {
    //   if (err) {
    //     return next(err);
    //   }

    //   //sending the pdf file
    //   res.setHeader("Content-Type", "application/pdf");
    //   res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
    //   res.send(data);
    // });

    //using stream
    // const file = fs.createReadStream(invoicePath);

    // file.pipe(res); //res is a writable stream
  });
};
