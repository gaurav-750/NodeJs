const User = require("../models/user");

const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");

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
