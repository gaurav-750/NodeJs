const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const errorController = require("./controllers/error");

//* Connect to MongoDB
const db = require("./utils/database");
const User = require("./models/user");

const app = express();

const store = new MongoDBStore({
  uri: "mongodb+srv://somanigaurav:6owytrHAY2W2K1Zr@nodeshop.d9s3efh.mongodb.net/shop?retryWrites=true&w=majority",
  collection: "sessions",
});

//* tell express to use ejs for templating
app.set("view engine", "ejs");
app.set("views", "views"); //tell express where to find the views

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

//* initialize session middleware
app.use(
  session({
    secret: "mysessionsecret",
    name: "sessionid", //default is 'connect.sid
    resave: false,
    saveUninitialized: false,

    store: store,
  })
);

//* middleware to add user to request
app.use((req, res, next) => {
  User.findById("65b5d2a868eecb5c56c90e7e")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log("err in User middleware:", err);
    });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//404 page
app.use("/", errorController.get404);

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});
