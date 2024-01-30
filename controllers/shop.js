const Order = require("../models/order");
const Product = require("../models/product");

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getIndex] err:", err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getProducts] err:", err);
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getProductDetail] err:", err);
    });
};

//! CART
exports.getCart = (req, res, next) => {
  //
  // console.log(req.user);
  req.session.user.populate("cart.items.productId").then((user) => {
    // console.log("[Controllers/Shop/getCart] products:", user.cart.items);

    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: user.cart.items,
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};

//add products to Cart
exports.addToCart = (req, res, next) => {
  console.log("[Controllers/Shop/addToCart] req.body:", req.body);
  const { productId } = req.body;

  Product.findById(productId)
    .then((product) => {
      return req.session.user.addToCart(product);
    })
    .then((result) => {
      console.log("[Controllers/Shop/addToCart] result:", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/addToCart] err:", err);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log("[Controllers/Shop/postCartDeleteProduct] req.body:", req.body);
  const { productId } = req.body;

  // User
  req.session.user
    .deleteItemFromCart(productId)
    .then((result) => {
      console.log("[Controllers/Shop/postCartDeleteProduct] result:", result);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/postCartDeleteProduct] err:", err);
    });
};

exports.getOrders = (req, res, next) => {
  //get all the orders of the user

  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      console.log("[Controllers/Shop/getOrders] orders:", orders);

      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getOrders] err:", err);
    });
};

exports.createOrder = (req, res, next) => {
  //
  req.session.user
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
          name: req.session.user.name,
          userId: req.session.user._id,
        },
      });
    })
    .then((result) => {
      console.log("[Controllers/Shop/createOrder] result:", result);

      //clear the cart
      req.session.user.cart = { items: [] };
      req.session.user.save();

      res.redirect("/orders");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/createOrder] err:", err);
    });
};
