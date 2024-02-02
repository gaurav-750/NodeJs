//To manage authentication routes
const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

//* /auth/signup
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

//* /auth/login
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

// /auth/logout
router.post("/logout", authController.logout);

// /auth/reset
router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
