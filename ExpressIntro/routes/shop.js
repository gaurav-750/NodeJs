const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("In another middleware!");

  //sending response
  res.send("<h1> Hello from Express.js </h1>");
});

module.exports = router;
