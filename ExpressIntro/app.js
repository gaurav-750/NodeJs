const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const expressHbs = require("express-handlebars");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const app = express();

app.engine(
  "handlebars",
  expressHbs({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "handlebars",
  })
);
//* tell express to use handlebars for templating
app.set("view engine", "handlebars");

//* tell express to use pug for templating
// app.set("view engine", "pug");
app.set("views", "views"); //tell express where to find the views

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminData.router);
app.use(shopRoutes);

//404 page
app.use("/", (req, res, next) => {
  // res.status(404).send("<h1> Page not found </h1>");

  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));

  res.status(404).render("404", {
    pageTitle: "404",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
