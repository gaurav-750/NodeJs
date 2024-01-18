const path = require("path");
const express = require("express");

const router = express.Router();
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  //sending response
  // res.send("<h1> Hello from Express.js </h1>");

  console.log(adminData.products);
  //sending html file
  // res.sendFile(path.join(__dirname, "../", "views", "shop.html"));

  //rendering pug file -> shop.pug
  res.render("shop", {
    prods: adminData.products, //passing data to pug file
    pageTitle: "Shop",
    path: "/",
    hasProducts: adminData.products.length > 0,
    activeShop: true,
    productCss: true,
    // layout: false,
  });
});

module.exports = router;
