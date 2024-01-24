const Product = require("../models/product");
const Cart = require("../models/cart");
const CartItem = require("../models/cart-item");

exports.getIndex = (req, res, next) => {
  //* using sequelize

  Product.findAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getIndex] err:", err);
    });
};

exports.getProducts = (req, res, next) => {
  //* using sequelize

  Product.findAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getProducts] err:", err);
    });
};

exports.getProductDetail = (req, res, next) => {
  console.log("[Controllers/Shop/getProductDetail] req.params:", req.params);
  const prodId = req.params.productId;

  Product.findByPk(prodId)
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
    });
};

//! CART
exports.getCart = (req, res, next) => {
  Cart.findAll({
    where: {
      userId: req.user.id,
    },
  })
    .then((cart) => {
      // console.log("[Controllers/Shop/getCart] cart:", cart);
      return cart[0].getProducts();
    })
    .then((products) => {
      //get the products of the cart
      // console.log("[Controllers/Shop/getCart] products:", products);

      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/getCart] err:", err);
    });
};

//add products to Cart
exports.addToCart = (req, res, next) => {
  console.log("[Controllers/Shop/addToCart] req.body:", req.body);
  const { productId } = req.body;

  let fetchedCart;
  //first find whether the user has a cart
  Cart.findOne({
    where: {
      userId: req.user.id,
    },
  })
    .then((cart) => {
      console.log("[Controllers/Shop/addToCart] cart:", cart);
      if (!cart) {
        //cart not found
        return Cart.create({
          //create a new cart
          userId: req.user.id,
        });
      }
      return cart;
    })
    .then((cart) => {
      fetchedCart = cart;

      //check if the product is already in the cart
      return CartItem.findOne({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });
    })
    .then((cartItem) => {
      if (cartItem) {
        cartItem.quantity += 1; //means product is already there in the cart
        return cartItem.save();
      }

      //product is not added to the cart yet
      return CartItem.create({
        cartId: fetchedCart.id,
        productId: productId,
        quantity: 1,
      });
    })
    .then((cartItem) => {
      console.log("[Controllers/Shop/addToCart] cartItem:", cartItem);
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/addToCart] err:", err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  console.log("[Controllers/Shop/postCartDeleteProduct] req.body:", req.body);
  const { productId } = req.body;

  Cart.findOne({
    where: {
      userId: req.user.id,
    },
  })
    .then((cart) => {
      CartItem.destroy({
        where: {
          cartId: cart.id,
          productId: productId,
        },
      });
    })
    .then(() => {
      console.log("[Controllers/Shop/addToCart] CartItem Deleted");
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log("[Controllers/Shop/postCartDeleteProduct] err:", err);
    });
};
