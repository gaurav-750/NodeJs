const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://somanigaurav:6owytrHAY2W2K1Zr@nodeshop.d9s3efh.mongodb.net/?retryWrites=true&w=majority";

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("Connected to MongoDB!");

      _db = client.db(); //this will give access to 'nodeshop' database

      callback();
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB:", err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

module.exports = { mongoConnect, getDb };
