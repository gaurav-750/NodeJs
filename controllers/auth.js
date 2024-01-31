const User = require("../models/user");

//* Controllers for authentication

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postSignup = (req, res, next) => {};

exports.getLogin = (req, res, next) => {
  console.log("🛑", req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  console.log("Inside postLogin");
  //   req.isLoggedIn = true; //this wont work because the request is not shared between requests

  //Hence we set a cookie
  // res.setHeader("Set-Cookie", "loggedIn=true");

  User.findById("65b5d2a868eecb5c56c90e7e")
    .then((user) => {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.log("err in session save:", err);
        res.redirect("/");
      });
    })
    .catch((err) => {
      console.log("err in User middleware:", err);
    });
};

exports.logout = (req, res, next) => {
  //clear the session
  req.session.destroy((err) => {
    if (err) {
      console.log("err in logout:", err);
    }

    res.redirect("/");
  });
};
