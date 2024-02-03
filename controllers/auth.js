const User = require("../models/user");

const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//* Controllers for authentication

exports.getSignup = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: msg,
  });
};

exports.postSignup = (req, res, next) => {
  console.log("[Controllers/Auth/postSignup]: req.body", req.body);
  const { email, password, confirmPassword } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("errors:", errors.array());

    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
    });
  }

  //check if user already exists
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "Email already exists. Please pick a different one."
        );
        return res.redirect("/auth/signup");
      }

      bcryptjs.hash(password, 12).then((hashedPassword) => {
        //if user does not exist, create a new user
        User.create({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        }).then((result) => {
          console.log("result in postSignup:", result);

          //* send email
          let mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Signup succeeded!",
            text: "You successfully signed up on NodeShop!",
          };

          transport.sendMail(mailOptions, (err, data) => {
            if (err) {
              console.log(
                "[Controllers/Auth/postSignup]: err in sending email:",
                err
              );
            } else {
              console.log("Email sent: " + data.response);
            }
          });

          res.redirect("/auth/login");
        });
      });
    })
    .catch((err) => {
      console.log("err in postSignup:", err);
    });
};

exports.getLogin = (req, res, next) => {
  // console.log("🛑", req.session.isLoggedIn);

  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }
  console.log("msg:", msg);

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: msg,
  });
};

exports.postLogin = (req, res, next) => {
  console.log("[Controllers/Auth/postLogin]: req.body", req.body);
  const { email, password } = req.body;

  //find the user by email
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", ["Invalid email or password."]);
        return req.session.save((err) => {
          res.redirect("/auth/login");
        });
        // return res.redirect("/auth/login");
      }

      //validate the password
      bcryptjs.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          req.flash("error", "Invalid email or password.");
          return res.redirect("/auth/login");
        }

        //* if password matches, set the session
        req.session.user = user;
        req.session.isLoggedIn = true;
        return req.session.save((err) => {
          console.log("err in session save:", err);
          res.redirect("/");
        });
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

exports.getResetPassword = (req, res, next) => {
  let msg = req.flash("error");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  res.render("auth/password-reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: msg,
  });
};

exports.postResetPassword = (req, res, next) => {
  console.log("[Controllers/Auth/postResetPassword]: req.body", req.body);
  const { email } = req.body;

  //? WE ARE USING 'CRYPTO' TO GENERATE A RANDOM TOKEN
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log("err in randomBytes:", err);
      return res.redirect("/auth/reset-password");
    }

    const token = buffer.toString("hex");
    console.log("🛑token generated:", token);

    //find user
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/auth/reset-password");
        }

        user.resetPasswordToken = token;
        user.resetPasswordTokenExpiration = Date.now() + 600000; //10 minutes

        return user.save();
      })
      .then((result) => {
        console.log("result in postResetPassword:", result);
        res.redirect("/");

        //* send email
        let mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: email,
          subject: "Reset Password",
          text: `
              <p> You requested for a password reset. </p>
              <p> Click this <a href="http://localhost:3000/auth/new-password/${token}"> link </a> to set a new password. </p>
          `,
        };

        transport.sendMail(mailOptions, (err, data) => {
          if (err) {
            console.log(
              "[Controllers/Auth/postResetPassword]: err in sending email:",
              err
            );
          } else {
            console.log("Email sent: " + data.response);
          }
        });
      })
      .catch((err) => {
        console.log("err in postResetPassword:", err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  console.log("[Controllers/Auth/getNewPassword]: req.params", req.params);
  const { token } = req.params;

  User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      console.log("user in getNewPassword:", user);
      let msg = req.flash("error");
      if (msg.length > 0) {
        msg = msg[0];
      } else {
        msg = null;
      }

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        userId: user._id.toString(),
        token: token,
        errorMessage: msg,
      });
    })
    .catch((err) => {
      console.log("err in getNewPassword:", err);
    });
};

exports.postNewPassword = (req, res, next) => {
  console.log("[Controllers/Auth/postNewPassword]: req.body", req.body);
  const { userId, token, password } = req.body;

  User.findOne({
    _id: userId,
    resetPasswordToken: token,
    resetPasswordTokenExpiration: { $gt: Date.now() },
  }).then((user) => {
    //hash the new password and save it

    bcryptjs
      .hash(password, 12)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiration = undefined;

        return user.save();
      })
      .then((result) => {
        console.log("result in postNewPassword:", result);

        res.redirect("/auth/login");
      });
  });
};
