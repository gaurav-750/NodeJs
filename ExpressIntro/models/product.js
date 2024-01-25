const db = require("../utils/database");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log("result🛑", result, result.insertedId);
      })
      .catch((err) => {
        console.log("err in save", err);
      });
  }
}

module.exports = Product;
