const uri = process.env.MONGO_URI;

const mongoose = require("mongoose");
const User = require("../models/user");

//* Connect to MongoDB using mongoose
mongoose.connect(uri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

module.exports = db;
