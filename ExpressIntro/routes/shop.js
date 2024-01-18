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
    prods: adminData.products, //passing data to ejs file
    pageTitle: "Shop",
    path: "/",
  });
});

module.exports = router;
