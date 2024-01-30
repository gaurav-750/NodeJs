//To manage authentication routes
const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

//* /auth/login
router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

module.exports = router;
