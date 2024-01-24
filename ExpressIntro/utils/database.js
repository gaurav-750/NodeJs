// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("node_shop", "root", "pass123", {
//   host: "localhost",
//   dialect: "mysql",
// });

// module.exports = sequelize;

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://somanigaurav:6owytrHAY2W2K1Zr@nodeshop.d9s3efh.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

client
  .connect()
  .then((client) => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

module.exports = client;
