const Product = require("../models/product");
// const Cart = require("../models/cart");
// const CartItem = require("../models/cart-item");
// const OrderItem = require("../models/order-item");

exports.getIndex = (req, res, next) => {
  //* using mongodb

  Product.fetchAllProducts()
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
  //* using mongodb

  Product.fetchAllProducts()
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

  Product.fetchProductDetail(prodId)
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
  //
  req.user.getCart().then((products) => {
    console.log("[Controllers/Shop/getCart] products:", products);
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  });
};

//add products to Cart
exports.addToCart = (req, res, next) => {
  console.log("[Controllers/Shop/addToCart] req.body:", req.body);
  const { productId } = req.body;

  Product.fetchProductDetail(productId)
    .then((product) => {
      return req.user.addToCart(product);
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

  req.user
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
  req.user
    .getOrders({ include: ["products"] })
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
    });
};

exports.createOrder = (req, res, next) => {
  //take all the cart items and move them to the order table

  let fetchedCart;
  Cart.findOne({
    where: {
      userId: req.user.id,
    },
  })
    .then((cart) => {
      fetchedCart = cart;

      //get the Cartitems
      return CartItem.findAll({
        where: {
          cartId: cart.id,
        },
      });
    })
    .then((items) => {
      //create an order
      //using magic method
      return req.user
        .createOrder()
        .then((order) => {
          //prepare data for bulk creation
          const orderItemsData = items.map((cartItem) => {
            return {
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              orderId: order.id,
            };
          });

          return OrderItem.bulkCreate(orderItemsData);
        })
        .then((result) => {
          //-> delete all the cart items
          return fetchedCart.setProducts(null);
        })
        .then((result) => {
          res.redirect("/orders");
        });
    })
    .catch((err) => {
      console.log("[Controllers/Shop/createOrder] err:", err);
    });
};
