const uri =
  "mongodb+srv://somanigaurav:6owytrHAY2W2K1Zr@nodeshop.d9s3efh.mongodb.net/shop?retryWrites=true&w=majority";

const mongoose = require("mongoose");

//* Connect to MongoDB using mongoose
mongoose.connect(uri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB!");
});

module.exports = db;
