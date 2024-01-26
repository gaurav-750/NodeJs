const getDb = require("../utils/database").getDb;
const { ObjectId } = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();

    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log("result", result, result.insertedId);
      })
      .catch((err) => {
        console.log("err in save", err);
      });
  }

  static fetchAllProducts() {
    const db = getDb();

    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log("products", products);
        return products;
      })
      .catch((err) => {
        console.log("err in fetchAllProducts", err);
      });
  }

  static fetchProductDetail(prodId) {
    const db = getDb();

    return db
      .collection("products")
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then((product) => {
        console.log("product", product);
        return product;
      })
      .catch((err) => {
        console.log("err in fetchProductDetail", err);
      });
  }
}

module.exports = Product;
