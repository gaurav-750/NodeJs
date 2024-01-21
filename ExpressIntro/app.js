const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const db = require("./utils/database");

const app = express();

db.execute("select * from products")
  .then((result) => {
    console.log("result", result[0]);
  })
  .catch((err) => {
    console.log("err", err);
  });

//* tell express to use ejs for templating
app.set("view engine", "ejs");
app.set("views", "views"); //tell express where to find the views

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//404 page
app.use("/", errorController.get404);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
