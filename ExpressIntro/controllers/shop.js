const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndex = (req, res, next) => {
  //
  Product.fetchAllProducts()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows, //passing data to ejs file
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts()
    .then(([rows, fieldData]) => {
      res.render("shop/product-list", {
        prods: rows, //passing data to ejs file
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetail = (req, res, next) => {
  const prodId = req.params.productId;
  console.log("prodId =>", prodId);

  Product.findProductById(prodId)
    .then(([product]) => {
      console.log("product =>", product);
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getProductsOfCart((cart) => {
    Product.fetchAllProducts((products) => {
      const cartProducts = [];
      for (prod of products) {
        const cartProductData = cart.products.find((p) => p.id === prod.id);
        if (cartProductData) {
          cartProducts.push({ productData: prod, qty: cartProductData.qty });
        }
      }

      console.log("cartProducts =>", cartProducts);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

exports.addToCart = (req, res, next) => {
  const { productId } = req.body;
  console.log("[Controllers/Shop]: addToCart", productId);

  Product.findProductById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });

  res.redirect("/cart");
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);

    res.redirect("/cart");
  });
};
