const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

const sequelize = require("./utils/database");

const app = express();

//* tell express to use ejs for templating
app.set("view engine", "ejs");
app.set("views", "views"); //tell express where to find the views

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

//404 page
app.use("/", errorController.get404);

sequelize
  .sync()
  .then((result) => {
    // console.log("result in sync:", result);
    console.log("Connected to Database successfully!");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("err in sync:", err);
  });
