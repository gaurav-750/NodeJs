//To manage authentication routes
const express = require("express");
const { check, body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/user");

//* /auth/signup
//? Validating email & password using 'express-validator'
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Please enter a valid email"),

    body("email").custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists. Please pick a different one.");
      }
      return true;
    }),

    check("password", "Password should be at least 4 characters long").isLength(
      {
        min: 4,
      }
    ),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],

  authController.postSignup
);

//* /auth/login
router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email").custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) {
        throw new Error("This email does not exist. Please signup first.");
      }
      return true;
    }),
  ],
  authController.postLogin
);

// /auth/logout
router.post("/logout", authController.logout);

// /auth/reset
router.get("/reset-password", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);

router.get("/new-password/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
