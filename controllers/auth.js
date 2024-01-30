//* Controllers for authentication

exports.getLogin = (req, res, next) => {
  // const isLoggedIn =
  //   req.get("Cookie").split(";")[1].trim().split("=")[1] === "true";

  console.log("🛑", req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  console.log("Inside postLogin");
  //   req.isLoggedIn = true; //this wont work because the request is not shared between requests

  //Hence we set a cookie
  // res.setHeader("Set-Cookie", "loggedIn=true");
  console.log(req.get("Cookie"));

  req.session.isLoggedIn = true;

  res.redirect("/");
};
