const path = require("path");
const express = require("express");

const router = express.Router();

//admin/add-product
router.get("/add-product", (req, res, next) => {
  //sending html file

  res.sendFile(path.join(__dirname, "../", "views", "add-product.html"));
});

//admin/product
router.post("/add-product", (req, res, next) => {
  console.log(req.body);

  res.redirect("/");
});

module.exports = router;
